package com.laexwallet.testnet;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.KeyguardManager;
import android.hardware.biometrics.BiometricManager;
import android.hardware.biometrics.BiometricPrompt;
import android.os.CancellationSignal;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import org.json.JSONArray;
import org.json.JSONObject;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class MainActivity extends Activity {
    private final int bg=Color.rgb(11,17,23),surface=Color.rgb(21,35,29),mint=Color.rgb(142,228,189),text=Color.rgb(239,247,243),muted=Color.rgb(181,204,191);
    private LinearLayout root,body;
    private Bitmap brandBitmap;
    private LocalVault vault;
    private SharedPreferences prefs;
    private final TestnetRpc rpc=new TestnetRpc();
    private final ExecutorService worker=Executors.newSingleThreadExecutor();
    private volatile long epoch=0;
    private volatile boolean visible=false;
    private boolean unlocked=false,busy=false,resumed=false;
    private final AuthenticationFlow authentication=new AuthenticationFlow();
    private CancellationSignal authenticationSignal;
    private byte[] importEntropy;
    private String address="",backupPhrase="";
    private WalletCore.Draft draft;
    private BigInteger balance=null;

    @Override public void onCreate(Bundle saved){
        super.onCreate(saved);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
        vault=new LocalVault(this);prefs=getSharedPreferences("testnet-public-data",MODE_PRIVATE);
        address=prefs.getString("address","");
        root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setBackground(new GradientDrawable(GradientDrawable.Orientation.TL_BR,new int[]{Color.rgb(10,27,24),bg,bg}));
        root.setOnApplyWindowInsetsListener((v,insets)->{android.graphics.Insets bars=insets.getInsets(android.view.WindowInsets.Type.systemBars()|android.view.WindowInsets.Type.ime());v.setPadding(bars.left,bars.top,bars.right,bars.bottom);return insets;});
        setContentView(root);locked();
    }
    @Override public void onStart(){super.onStart();visible=true;}
    @Override public void onStop(){
        visible=false;epoch++;unlocked=false;busy=false;backupPhrase="";balance=null;
        if(!authentication.isPending()){draft=null;wipeImport();}
        locked();super.onStop();
    }
    @Override public void onPause(){resumed=false;super.onPause();}
    @Override public void onDestroy(){authentication.clear();if(authenticationSignal!=null)authenticationSignal.cancel();worker.shutdownNow();wipeImport();super.onDestroy();}
    @Override public void onBackPressed(){if(unlocked){draft=null;backupPhrase="";home();}else super.onBackPressed();}
    private int dp(int value){return Math.round(value*getResources().getDisplayMetrics().density);}
    private GradientDrawable box(int color){GradientDrawable d=new GradientDrawable();d.setColor(color);d.setCornerRadius(dp(20));d.setStroke(dp(1),Color.rgb(43,65,58));return d;}
    private TextView label(String value,int size,int color){TextView t=new TextView(this);t.setText(value);t.setTextColor(color);t.setTextSize(size);t.setLineSpacing(dp(3),1);t.setPadding(0,dp(5),0,dp(5));t.setFontFeatureSettings("kern");return t;}
    private void screen(String title,String subtitle){
        root.removeAllViews();
        LinearLayout header=new LinearLayout(this);header.setGravity(Gravity.CENTER_VERTICAL);header.setPadding(dp(20),dp(8),dp(20),dp(6));
        header.addView(new LogoView(),new LinearLayout.LayoutParams(dp(34),dp(34)));
        TextView brand=label("  laexWallet",23,text);
        android.text.SpannableString wordmark=new android.text.SpannableString("  laexWallet");
        wordmark.setSpan(new android.text.style.ForegroundColorSpan(mint),6,wordmark.length(),0);brand.setText(wordmark);
        brand.setTypeface(Typeface.create("sans-serif-medium",Typeface.NORMAL));header.addView(brand,new LinearLayout.LayoutParams(0,-2,1));
        TextView tag=label("PRUEBAS",10,mint);tag.setLetterSpacing(.10f);tag.setPadding(dp(10),dp(7),dp(10),dp(7));tag.setBackground(box(surface));header.addView(tag);root.addView(header);
        TextView banner=label("●  BNB testnet · Sin dinero real",12,muted);banner.setGravity(Gravity.CENTER);root.addView(banner);
        ScrollView scroll=new ScrollView(this);scroll.setFillViewport(true);scroll.setVerticalScrollBarEnabled(false);root.addView(scroll,new LinearLayout.LayoutParams(-1,0,1));
        body=new LinearLayout(this);body.setOrientation(LinearLayout.VERTICAL);body.setPadding(dp(20),dp(12),dp(20),dp(16));scroll.addView(body);
        if(!title.isEmpty()){TextView h=label(title,28,text);h.setTypeface(Typeface.create("sans-serif-medium",Typeface.NORMAL));h.setLetterSpacing(-.025f);h.setAccessibilityHeading(true);body.addView(h);}
        if(!subtitle.isEmpty())body.addView(label(subtitle,16,muted));
        if(unlocked&&!busy&&!title.isEmpty())navigation(title);
    }
    private void navigation(String title){
        LinearLayout nav=new LinearLayout(this);nav.setGravity(Gravity.CENTER);nav.setPadding(dp(12),dp(6),dp(12),dp(5));nav.setBackgroundColor(Color.rgb(12,23,22));
        navItem(nav,"Inicio","wallet",title.equals("Mi wallet"),this::home);
        navItem(nav,"Actividad","activity",title.startsWith("Actividad"),this::history);
        navItem(nav,"Seguridad","shield",title.startsWith("Tu seguridad"),this::security);
        root.addView(nav);
    }
    private void navItem(LinearLayout row,String title,String icon,boolean selected,Runnable action){
        LinearLayout item=new LinearLayout(this);item.setOrientation(LinearLayout.VERTICAL);item.setGravity(Gravity.CENTER);item.setPadding(dp(4),dp(3),dp(4),dp(3));item.setMinimumHeight(dp(54));
        item.addView(new Glyph(icon,selected?mint:muted),new LinearLayout.LayoutParams(dp(22),dp(22)));
        TextView name=label(title,12,selected?mint:muted);name.setGravity(Gravity.CENTER);item.addView(name);
        row.addView(item,new LinearLayout.LayoutParams(0,-2,1));clickable(item,title,action);
    }
    private void clickable(View view,String description,Runnable action){
        view.setContentDescription(description);view.setFocusable(true);view.setClickable(true);view.setOnClickListener(v->{if(!busy)action.run();});
        view.setAccessibilityDelegate(new View.AccessibilityDelegate(){@Override public void onInitializeAccessibilityNodeInfo(View host,android.view.accessibility.AccessibilityNodeInfo info){super.onInitializeAccessibilityNodeInfo(host,info);info.setClassName("android.widget.Button");}});
    }
    private void actionItem(LinearLayout row,String title,String icon,boolean primary,Runnable action){
        LinearLayout item=new LinearLayout(this);item.setOrientation(LinearLayout.VERTICAL);item.setGravity(Gravity.CENTER);item.setMinimumHeight(dp(86));
        android.widget.FrameLayout tile=new android.widget.FrameLayout(this);tile.setBackground(box(primary?mint:surface));
        android.widget.FrameLayout.LayoutParams glyphSize=new android.widget.FrameLayout.LayoutParams(dp(25),dp(25),Gravity.CENTER);tile.addView(new Glyph(icon,primary?bg:mint),glyphSize);
        item.addView(tile,new LinearLayout.LayoutParams(dp(52),dp(52)));TextView name=label(title,14,text);name.setGravity(Gravity.CENTER);item.addView(name);
        row.addView(item,new LinearLayout.LayoutParams(0,-2,1));clickable(item,title,action);
    }
    private void space(int size){body.addView(new View(this),new LinearLayout.LayoutParams(1,dp(size)));}
    private void note(String value){TextView t=label(value,15,muted);t.setBackground(box(surface));t.setPadding(dp(14),dp(10),dp(14),dp(10));LinearLayout.LayoutParams lp=new LinearLayout.LayoutParams(-1,-2);lp.setMargins(0,dp(10),0,dp(6));body.addView(t,lp);}
    private Button button(String title,Runnable action,boolean primary){Button b=new Button(this);b.setText(title);b.setTextSize(16);b.setAllCaps(false);b.setTypeface(Typeface.create("sans-serif-medium",Typeface.NORMAL));b.setStateListAnimator(null);b.setTextColor(primary?bg:text);b.setBackground(box(primary?mint:surface));b.setPadding(dp(12),dp(12),dp(12),dp(12));b.setMinHeight(dp(52));LinearLayout.LayoutParams lp=new LinearLayout.LayoutParams(-1,-2);lp.setMargins(0,dp(10),0,0);body.addView(b,lp);b.setOnClickListener(v->{if(!busy)action.run();});return b;}
    private EditText field(String title,int input){body.addView(label(title,16,text));EditText e=new EditText(this);e.setTextSize(17);e.setTextColor(text);e.setHintTextColor(muted);e.setBackground(box(surface));e.setPadding(dp(14),dp(12),dp(14),dp(12));e.setInputType(input);e.setImportantForAutofill(View.IMPORTANT_FOR_AUTOFILL_NO_EXCLUDE_DESCENDANTS);e.setSaveEnabled(false);body.addView(e,new LinearLayout.LayoutParams(-1,-2));return e;}
    private void failure(String message){if(!visible)return;AlertDialog.Builder dialog=new AlertDialog.Builder(this).setTitle("Revisa este paso").setMessage(message).setPositiveButton("Entendido",null);if(message.contains("LW-101"))dialog.setNeutralButton("Copiar código",(d,w)->getSystemService(ClipboardManager.class).setPrimaryClip(ClipData.newPlainText("Diagnóstico laexWallet",message.substring(message.indexOf("LW-101")))));dialog.show();}
    private String safeError(Throwable error){if(error instanceof LinkageError)return "La app encontró una incompatibilidad al preparar la cuenta. No uses Recuperar para crear una cuenta nueva. Comparte solo este código de diagnóstico:\n\n"+OperationResult.diagnostic(error);if(error instanceof IllegalArgumentException||error instanceof IllegalStateException)return error.getMessage();if(error instanceof android.security.keystore.UserNotAuthenticatedException)return "La autorización caducó. Vuelve a confirmar con tu huella o el PIN del teléfono.";return "No se pudo completar el paso. Comprueba tu conexión y el bloqueo de pantalla. Si ya intentaste enviar, revisa el historial antes de repetir.";}
    private void authorize(Runnable action){authorize(action,false);}
    private void authorize(Runnable action,boolean pinOnly){
        if(authentication.isPending())return;
        KeyguardManager keyguard=getSystemService(KeyguardManager.class);
        if(!keyguard.isDeviceSecure()){failure("Configura primero un PIN, patrón o contraseña de bloqueo en los ajustes de tu Samsung.");return;}
        task("Preparando acceso seguro",vault::prepareAuthentication,legacy->{
            Runnable next=legacy?()->task("Habilitando huella y PIN",()->{vault.migrateAfterPin();return true;},ignored->action.run()):action;
            long request=authentication.begin(next);
            authenticationSignal=new CancellationSignal();
            int allowed=BiometricManager.Authenticators.DEVICE_CREDENTIAL;
            if(!legacy&&!pinOnly)allowed|=BiometricManager.Authenticators.BIOMETRIC_STRONG;
            String subtitle=legacy?"Usa tu PIN una vez para habilitar la huella en tu cuenta existente.":pinOnly?"Confirma con el PIN, patrón o contraseña de tu teléfono.":"Usa tu huella o el PIN de tu teléfono.";
            try{
                new BiometricPrompt.Builder(this).setTitle("laexWallet · Pruebas")
                    .setSubtitle(subtitle).setAllowedAuthenticators(allowed).build()
                    .authenticate(authenticationSignal,getMainExecutor(),new BiometricPrompt.AuthenticationCallback(){
                        @Override public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult result){
                            if(!authentication.isCurrent(request))return;
                            authenticationSignal=null;authentication.accept(request);continueAuthenticated();
                        }
                        @Override public void onAuthenticationError(int code,CharSequence message){
                            if(!authentication.cancel(request))return;
                            authenticationSignal=null;unlocked=false;draft=null;wipeImport();locked();
                            if(code!=BiometricPrompt.BIOMETRIC_ERROR_CANCELED&&code!=BiometricPrompt.BIOMETRIC_ERROR_USER_CANCELED)
                                failure("No se pudo completar la autenticación. Puedes usar la opción de PIN del teléfono.");
                        }
                    });
            }catch(Exception error){authentication.cancel(request);authenticationSignal=null;throw error;}
        });
    }
    @Override protected void onPostResume(){super.onPostResume();visible=true;resumed=true;continueAuthenticated();}
    private void continueAuthenticated(){
        Runnable action=authentication.consume(resumed&&visible);
        if(action!=null){unlocked=true;OperationResult<Void> result=OperationResult.run(()->{action.run();return null;});if(result.error!=null){locked();failure(safeError(result.error));}}
    }
    private void wipeImport(){if(importEntropy!=null){Arrays.fill(importEntropy,(byte)0);importEntropy=null;}}
    private interface Done<T>{void run(T value)throws Exception;}
    private <T> void task(String title,OperationResult.Work<T> work,Done<T> done){
        busy=true;long ticket=epoch;screen(title,"Espera un momento. No cierres la aplicación.");
        worker.execute(()->{
            OperationResult<T> result=OperationResult.run(work);
            runOnUiThread(()->{
                if(!visible||ticket!=epoch)return;
                busy=false;
                Throwable error=result.error;
                if(error==null)error=OperationResult.run(()->{done.run(result.value);return null;}).error;
                if(error!=null){if(vault.exists()&&unlocked)home();else locked();failure(safeError(error));}
            });
        });
    }
    private void locked(){
        screen("","");
        body.addView(new OrbitArt(),new LinearLayout.LayoutParams(-1,dp(154)));
        TextView eyebrow=label("HECHA PARA TI",11,mint);eyebrow.setLetterSpacing(.22f);eyebrow.setGravity(Gravity.CENTER);body.addView(eyebrow);
        TextView title=label(vault.exists()?"Tu mundo.\nBajo tu control.":"Tu próxima wallet.\nTu propio camino.",34,text);title.setGravity(Gravity.CENTER);title.setTypeface(Typeface.create("sans-serif-medium",Typeface.NORMAL));title.setLetterSpacing(-.04f);body.addView(title);
        TextView copy=label(vault.exists()?"Tus claves se protegen en este teléfono. Entra con tu huella o tu PIN.":"Una forma sencilla de empezar. Crea tu cuenta y aprende con monedas de prueba.",16,muted);copy.setGravity(Gravity.CENTER);body.addView(copy);space(6);
        if(vault.exists()){
            button("Entrar con huella o PIN",()->authorize(this::unlock),true);
            button("Usar solo PIN del teléfono",()->authorize(this::unlock,true),false);
        }else {button("Crear mi wallet de prueba",()->authorize(this::create),true);button("Ya tengo un respaldo de prueba",()->authorize(this::restore),false);}
        note("Solo BNB testnet. Sin dinero real. OMDB, OMD, intercambios y Web3 todavía no están habilitados en esta app.");
    }
    private void unlock(){task("Abriendo tu wallet",()->{byte[] entropy=vault.read();try{return WalletCore.address(entropy);}finally{Arrays.fill(entropy,(byte)0);}},value->{address=value;prefs.edit().putString("address",address).commit();home();});}
    private void create(){task("Creando tu cuenta",()->{byte[] entropy=WalletCore.newEntropy();try{String value=WalletCore.address(entropy);vault.save(entropy);return value;}finally{Arrays.fill(entropy,(byte)0);}},value->{address=value;prefs.edit().putString("address",value).putBoolean("backup",false).commit();showBackup();});}
    private void showBackup(){task("Preparando tu respaldo",()->{byte[] entropy=vault.read();try{return WalletCore.words(entropy);}finally{Arrays.fill(entropy,(byte)0);}},phrase->{backupPhrase=phrase;screen("Anota tus 12 palabras","Son el respaldo de esta cuenta de prueba. Escríbelas en papel y conserva su orden. Nunca las compartas, ni con LAEX.");String[] words=phrase.split(" ");for(int i=0;i<words.length;i+=2){LinearLayout row=new LinearLayout(this);for(int j=i;j<i+2;j++){TextView word=label(String.format(java.util.Locale.ROOT,"%02d  %s",j+1,words[j]),18,mint);word.setPadding(dp(10),dp(10),dp(8),dp(10));row.addView(word,new LinearLayout.LayoutParams(0,-2,1));}body.addView(row);}note("No hay botón de copiar. Las capturas están bloqueadas. Este respaldo corresponde solo a tu cuenta de pruebas.");button("Ya las anoté: comprobar",this::checkBackup,true);button("Guardar para después",()->{backupPhrase="";home();},false);});}
    private void checkBackup(){
        final String phrase=backupPhrase;
        if(phrase.split(" ").length!=12){home();return;}
        screen("Comprueba tu respaldo","Busca en tu papel las palabras número 1, 6 y 12. Escribe solo cada palabra, sin su número. Se aceptan mayúsculas y espacios al principio o al final.");
        int input=InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD|InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS;
        EditText a=field("Palabra número 1",input),b=field("Palabra número 6",input),c=field("Palabra número 12",input);
        a.setSingleLine(true);b.setSingleLine(true);c.setSingleLine(true);
        button("Verificar respaldo",()->{
            a.setError(null);b.setError(null);c.setError(null);
            int[] wrong=BackupCheck.incorrect(phrase,a.getText().toString(),b.getText().toString(),c.getText().toString());
            if(wrong.length>0){
                for(int position:wrong){EditText field=position==1?a:position==6?b:c;field.setError("Revisa la palabra número "+position+" de tu papel");}
                (wrong[0]==1?a:wrong[0]==6?b:c).requestFocus();
                failure("Revisa "+(wrong.length==1?"la palabra número ":"las palabras número ")+java.util.Arrays.toString(wrong).replace("[","").replace("]","")+". No escribas el número ni traduzcas la palabra. Si necesitas verla de nuevo, toca Volver a ver mis palabras.");return;
            }
            if(!prefs.edit().putBoolean("backup",true).commit()){failure("No se pudo guardar la comprobación. Inténtalo de nuevo.");return;}
            backupPhrase="";home();
        },true);
        button("Volver a ver mis palabras",()->authorize(this::showBackup),false);
    }
    private void restore(){screen("Recuperar cuenta de prueba","Usa únicamente una frase creada para pruebas. Nunca introduzcas aquí la frase de una wallet con dinero real.");EditText phrase=field("Tus 12 palabras de prueba",InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD|InputType.TYPE_TEXT_FLAG_MULTI_LINE|InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);phrase.setMinLines(3);CheckBox check=new CheckBox(this);check.setText("Confirmo que este respaldo es solo de pruebas");check.setTextColor(text);check.setTextSize(16);body.addView(check);button("Recuperar en este teléfono",()->{if(!check.isChecked()){failure("Confirma que usarás un respaldo de pruebas.");return;}try{importEntropy=WalletCore.entropy(phrase.getText().toString());phrase.setText("");authorize(()->task("Recuperando tu cuenta",()->{try{String value=WalletCore.address(importEntropy);vault.save(importEntropy);return value;}finally{wipeImport();}},value->{address=value;prefs.edit().putString("address",value).putBoolean("backup",true).commit();home();}));}catch(Exception e){wipeImport();failure(safeError(e));}},true);button("Volver",this::locked,false);}
    private void refreshBalance(){task("Actualizando saldo",()->rpc.balance(address),value->{balance=value;home();});}
    private void startSend(){if(!prefs.getBoolean("backup",false)){failure("Primero anota y verifica tu respaldo.");return;}if(!prefs.getString("pending","").isEmpty()){history();return;}send();}
    private void home(){
        if(!unlocked){locked();return;}backupPhrase="";screen("Mi wallet","");space(8);
        LinearLayout card=new LinearLayout(this);card.setOrientation(LinearLayout.VERTICAL);card.setBackground(new BalanceSurface());card.setPadding(dp(20),dp(15),dp(20),dp(13));
        card.addView(label("TU SALDO EN LA RED",11,Color.rgb(42,79,63)));
        TextView value=label(balance==null?"—":WalletCore.format(balance),42,Color.rgb(14,47,35));value.setTypeface(Typeface.create("sans-serif-medium",Typeface.NORMAL));value.setLetterSpacing(-.04f);value.setMaxLines(2);value.setAutoSizeTextTypeUniformWithConfiguration(22,42,1,android.util.TypedValue.COMPLEX_UNIT_SP);card.addView(value,new LinearLayout.LayoutParams(-1,dp(64)));
        card.addView(label(balance==null?"tBNB · Toca Actualizar para consultar":"tBNB · Monedas sin valor económico",13,Color.rgb(42,79,63)));
        View line=new View(this);line.setBackgroundColor(0x3340634e);LinearLayout.LayoutParams lineSize=new LinearLayout.LayoutParams(-1,dp(1));lineSize.setMargins(0,dp(9),0,dp(5));card.addView(line,lineSize);
        card.addView(label("BNB Smart Chain     /     TESTNET 97",12,Color.rgb(24,64,47)));body.addView(card);space(14);
        LinearLayout actions=new LinearLayout(this);actionItem(actions,"Enviar","send",false,this::startSend);actionItem(actions,"Recibir","receive",true,this::receive);actionItem(actions,"Actualizar","refresh",false,this::refreshBalance);body.addView(actions);
        if(!prefs.getBoolean("backup",false))button("Completar mi respaldo  →",()->authorize(this::showBackup),true);
        space(12);TextView section=label("Mis monedas",18,text);section.setTypeface(Typeface.create("sans-serif-medium",Typeface.NORMAL));body.addView(section);
        LinearLayout asset=new LinearLayout(this);asset.setGravity(Gravity.CENTER_VERTICAL);asset.setPadding(dp(14),dp(12),dp(14),dp(12));asset.setBackground(box(surface));
        Glyph coin=new Glyph("coin",Color.rgb(230,205,124));asset.addView(coin,new LinearLayout.LayoutParams(dp(38),dp(38)));
        LinearLayout names=new LinearLayout(this);names.setOrientation(LinearLayout.VERTICAL);names.setPadding(dp(12),0,dp(6),0);names.addView(label("BNB de prueba",16,text));names.addView(label("tBNB · Red de pruebas",12,muted));asset.addView(names,new LinearLayout.LayoutParams(0,-2,1));
        asset.addView(new Glyph("receive",mint),new LinearLayout.LayoutParams(dp(20),dp(20)));clickable(asset,"BNB de prueba: recibir tBNB",this::receive);body.addView(asset);
        TextView hint=label("Tu cuenta. Tus claves. Tu control.",12,muted);hint.setGravity(Gravity.CENTER);body.addView(hint);
    }
    private void receive(){
        screen("Recibir tBNB","Solo BNB testnet (97), sin dinero real. Comprueba siempre la red.");space(10);
        LinearLayout panel=new LinearLayout(this);panel.setOrientation(LinearLayout.VERTICAL);panel.setGravity(Gravity.CENTER);panel.setBackground(box(surface));panel.setPadding(dp(16),dp(15),dp(16),dp(12));
        TextView network=label("●  BNB SMART CHAIN · TESTNET",11,mint);network.setGravity(Gravity.CENTER);panel.addView(network);
        try{
            var matrix=new MultiFormatWriter().encode("ethereum:"+address+"@97",BarcodeFormat.QR_CODE,600,600);
            Bitmap bitmap=Bitmap.createBitmap(600,600,Bitmap.Config.RGB_565);for(int x=0;x<600;x++)for(int y=0;y<600;y++)bitmap.setPixel(x,y,matrix.get(x,y)?Color.BLACK:Color.WHITE);
            ImageView qr=new ImageView(this);qr.setImageBitmap(bitmap);qr.setContentDescription("QR de tu dirección en BNB testnet 97");qr.setPadding(dp(8),dp(8),dp(8),dp(8));qr.setBackgroundColor(Color.WHITE);
            int side=Math.min(204,getResources().getConfiguration().screenWidthDp-96);LinearLayout.LayoutParams size=new LinearLayout.LayoutParams(dp(side),dp(side));size.gravity=Gravity.CENTER;size.setMargins(0,dp(8),0,dp(10));panel.addView(qr,size);
        }catch(Exception e){panel.addView(label("Usa la dirección escrita debajo.",15,text));}
        TextView addressLabel=label("TU DIRECCIÓN DE PRUEBA",10,muted);addressLabel.setGravity(Gravity.CENTER);panel.addView(addressLabel);
        TextView value=label(address,14,text);value.setTypeface(Typeface.MONOSPACE);value.setGravity(Gravity.CENTER);value.setTextIsSelectable(true);panel.addView(value,new LinearLayout.LayoutParams(-1,-2));body.addView(panel);
        button("Copiar mi dirección",()->{getSystemService(ClipboardManager.class).setPrimaryClip(ClipData.newPlainText("Dirección BNB testnet 97",address));android.widget.Toast.makeText(this,"Dirección copiada",android.widget.Toast.LENGTH_SHORT).show();},true);
        button("Conseguir tBNB de prueba  ↗",()->open(WalletCore.FAUCET),false);
        button("¿Cómo consigo monedas de prueba?",()->new AlertDialog.Builder(this).setTitle("Monedas para practicar").setMessage("El botón abre el faucet oficial de BNB, un sitio que distribuye tBNB de prueba. Puede aplicar requisitos o límites. No necesitas comprar tBNB. Al regresar, desbloquea tu wallet y toca Actualizar.").setPositiveButton("Entendido",null).show(),false);
    }
    private void send(){screen("Enviar tBNB","BNB testnet · Máximo 1 tBNB. Solo a otra cuenta de prueba, no a contratos.");EditText to=field("Dirección de otra cuenta de prueba",InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);EditText amount=field("Cantidad de tBNB",InputType.TYPE_CLASS_NUMBER|InputType.TYPE_NUMBER_FLAG_DECIMAL);button("Revisar envío",()->{String recipient=to.getText().toString(),value=amount.getText().toString();task("Preparando el envío",()->rpc.prepare(address,recipient,value),result->{draft=result;review();});},true);button("Cancelar",this::home,false);}
    private void review(){if(draft==null){home();return;}screen("Revisa antes de enviar","La siguiente confirmación solicitará el bloqueo de tu teléfono para firmar localmente.");note("Red: BNB testnet (97)\n\nDesde: "+draft.from()+"\n\nDestino: "+draft.to()+"\n\nImporte: "+WalletCore.format(draft.value())+" tBNB\n\nComisión máxima: "+WalletCore.format(draft.fee())+" tBNB\n\nTotal máximo: "+WalletCore.format(draft.total())+" tBNB");button("Autorizar envío de prueba",()->authorize(this::submit),true);button("Editar envío",()->{draft=null;send();},false);}
    private void submit(){final WalletCore.Draft approved=draft;draft=null;if(approved==null){home();return;}final long ticket=epoch;
        task("Firmando y enviando a testnet",()->{
            if(!prefs.getString("pending","").isEmpty())throw new IllegalStateException("Hay un envío sin resolver. Consulta su estado.");
            rpc.revalidate(approved);if(!visible||ticket!=epoch)throw new IllegalStateException("La aplicación se bloqueó; vuelve a revisar el envío.");
            byte[] entropy=vault.read();String raw;try{raw=WalletCore.sign(entropy,approved,System.currentTimeMillis());}finally{Arrays.fill(entropy,(byte)0);}
            if(!visible||ticket!=epoch)throw new IllegalStateException("La aplicación se bloqueó antes de difundir el envío.");
            String hash=WalletCore.transactionHash(raw);
            JSONArray log=new JSONArray(prefs.getString("history","[]"));JSONObject record=new JSONObject().put("hash",hash).put("to",approved.to()).put("value",WalletCore.format(approved.value())).put("status","Pendiente de comprobar");JSONArray updated=new JSONArray().put(record);for(int i=0;i<Math.min(log.length(),29);i++)updated.put(log.get(i));
            if(!prefs.edit().putString("pending",hash).putString("history",updated.toString()).commit())throw new IllegalStateException("No se pudo guardar la referencia. El envío no se difundió.");
            rpc.broadcast(raw,hash);return hash;
        },hash->{balance=null;screen("Envío difundido","La red recibió tu transacción. Todavía debemos comprobar su confirmación.");note(hash);button("Comprobar estado",this::history,true);button("Abrir explorador testnet",()->open(WalletCore.EXPLORER+"/tx/"+hash),false);});
    }
    private void history(){screen("Actividad","Consulta aquí tus envíos. Si uno tarda, comprueba su estado antes de repetirlo.");
        try{JSONArray entries=new JSONArray(prefs.getString("history","[]"));if(entries.length()==0)note("Todavía no hay envíos desde esta aplicación. Los depósitos externos se reflejan al actualizar el saldo; el explorador muestra el historial completo.");for(int i=0;i<entries.length();i++){JSONObject item=entries.getJSONObject(i);String hash=item.getString("hash");note(item.getString("value")+" tBNB\nPara: "+item.getString("to")+"\n"+item.getString("status")+"\n"+hash);button("Consultar estado "+(i+1),()->task("Consultando el recibo",()->rpc.status(hash),status->{JSONArray current=new JSONArray(prefs.getString("history","[]"));for(int j=0;j<current.length();j++)if(current.getJSONObject(j).getString("hash").equals(hash))current.getJSONObject(j).put("status",status);SharedPreferences.Editor editor=prefs.edit().putString("history",current.toString());if(hash.equals(prefs.getString("pending",""))&&(status.startsWith("Confirmada")||status.startsWith("Fallida")))editor.remove("pending");editor.commit();history();}),false);button("Ver transacción "+(i+1),()->open(WalletCore.EXPLORER+"/tx/"+hash),false);}}catch(Exception e){note("No se pudo leer el historial local. No repitas un envío sin comprobarlo en el explorador.");}
        button("Ver cuenta en explorador testnet",()->open(WalletCore.EXPLORER+"/address/"+address),false);button("Volver a mi wallet",this::home,true);
    }
    private void security(){screen("Tu seguridad, primero","Versión 0.1.3-testnet · Piloto sin auditoría independiente.");note("• Entropía cifrada con AES-GCM y Android Keystore.\n• El desbloqueo utiliza biometría fuerte (como la huella) o el PIN, patrón o contraseña del teléfono.\n• La app se bloquea al pasar a segundo plano.\n• Copias del sistema y capturas desactivadas.\n• Solo firma para Chain ID 97.\n• No hay analítica ni envío de frases a servidores LAEX.");button("Ver respaldo de prueba",()->authorize(this::showBackup),false);note("El RPC puede observar tu IP y las direcciones consultadas. El respaldo se deriva mediante BIP39/BIP44, ruta m/44'/60'/0'/0/0, sin contraseña adicional BIP39. Nunca uses aquí una frase con fondos reales.");button("Bloquear ahora",()->{unlocked=false;draft=null;backupPhrase="";locked();},true);button("Volver",this::home,false);}
    private void open(String url){try{startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse(url)));}catch(Exception e){failure("No se encontró un navegador para abrir el enlace.");}}
    private Bitmap logoBitmap(){if(brandBitmap==null)brandBitmap=BitmapFactory.decodeResource(getResources(),R.drawable.wallet_logo);return brandBitmap;}
    private void drawLogo(Canvas canvas,RectF destination){Bitmap bitmap=logoBitmap();if(bitmap!=null)canvas.drawBitmap(bitmap,new Rect((int)(bitmap.getWidth()*.24),(int)(bitmap.getHeight()*.145),(int)(bitmap.getWidth()*.75),(int)(bitmap.getHeight()*.66)),destination,new android.graphics.Paint(3));}
    private final class LogoView extends View{
        LogoView(){super(MainActivity.this);setContentDescription("Logo laexWallet");}
        @Override protected void onDraw(Canvas canvas){super.onDraw(canvas);drawLogo(canvas,new RectF(0,0,getWidth(),getHeight()));}
    }
    private final class BalanceSurface extends GradientDrawable{
        BalanceSurface(){super(Orientation.TL_BR,new int[]{0xff9ee9c5,0xffc5dbb3});setCornerRadius(dp(24));}
        @Override public void draw(Canvas canvas){super.draw(canvas);int save=canvas.save();android.graphics.Path clip=new android.graphics.Path();clip.addRoundRect(new RectF(getBounds()),dp(24),dp(24),android.graphics.Path.Direction.CW);canvas.clipPath(clip);android.graphics.Paint p=new android.graphics.Paint(3);p.setStyle(android.graphics.Paint.Style.STROKE);p.setStrokeWidth(dp(1));p.setColor(0x24436850);for(int r=65;r<180;r+=24)canvas.drawCircle(getBounds().right+dp(30),getBounds().top+dp(72),dp(r),p);canvas.restoreToCount(save);}
    }
    private final class OrbitArt extends View{
        OrbitArt(){super(MainActivity.this);setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_NO);}
        @Override protected void onDraw(Canvas canvas){super.onDraw(canvas);float x=getWidth()/2f,y=getHeight()/2f;android.graphics.Paint p=new android.graphics.Paint(3);p.setStyle(android.graphics.Paint.Style.STROKE);p.setStrokeWidth(dp(1));p.setColor(0xff355649);canvas.drawOval(x-dp(128),y-dp(49),x+dp(128),y+dp(49),p);p.setColor(0xff213b32);canvas.drawOval(x-dp(150),y-dp(65),x+dp(150),y+dp(65),p);p.setStyle(android.graphics.Paint.Style.FILL);p.setColor(0xff132e24);canvas.drawRoundRect(x-dp(55),y-dp(55),x+dp(55),y+dp(55),dp(29),dp(29),p);drawLogo(canvas,new RectF(x-dp(38),y-dp(38),x+dp(38),y+dp(38)));p.setColor(mint);canvas.drawCircle(x+dp(120),y-dp(16),dp(3),p);canvas.drawCircle(x-dp(98),y+dp(31),dp(2),p);}
    }
    private final class Glyph extends View{
        private final String kind;private final int color;
        Glyph(String kind,int color){super(MainActivity.this);this.kind=kind;this.color=color;setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_NO);}
        @Override protected void onDraw(Canvas canvas){super.onDraw(canvas);int save=canvas.save();canvas.scale(getWidth()/24f,getHeight()/24f);android.graphics.Paint p=new android.graphics.Paint(3);p.setColor(color);p.setStrokeWidth(1.7f);p.setStyle(android.graphics.Paint.Style.STROKE);p.setStrokeCap(android.graphics.Paint.Cap.ROUND);p.setStrokeJoin(android.graphics.Paint.Join.ROUND);android.graphics.Path path=new android.graphics.Path();
            switch(kind){
                case "send":canvas.drawLine(5,19,19,5,p);path.moveTo(7,5);path.lineTo(19,5);path.lineTo(19,17);canvas.drawPath(path,p);break;
                case "receive":canvas.drawLine(19,5,5,19,p);path.moveTo(5,7);path.lineTo(5,19);path.lineTo(17,19);canvas.drawPath(path,p);break;
                case "refresh":canvas.drawArc(4,4,20,20,40,285,false,p);path.moveTo(20,3);path.lineTo(20,9);path.lineTo(14,9);canvas.drawPath(path,p);break;
                case "wallet":canvas.drawRoundRect(3,5,21,20,3,3,p);canvas.drawLine(4,9,20,9,p);canvas.drawRoundRect(14,12,22,17,2,2,p);break;
                case "activity":canvas.drawCircle(12,12,9,p);canvas.drawLine(12,6,12,12,p);canvas.drawLine(12,12,16,14,p);break;
                case "shield":path.moveTo(12,2);path.lineTo(21,6);path.lineTo(20,14);path.quadTo(18,20,12,23);path.quadTo(6,20,4,14);path.lineTo(3,6);path.close();canvas.drawPath(path,p);path.reset();path.moveTo(8,12);path.lineTo(11,15);path.lineTo(16,9);canvas.drawPath(path,p);break;
                default:p.setStyle(android.graphics.Paint.Style.FILL);for(int[] point:new int[][]{{12,5},{5,12},{12,12},{19,12},{12,19}}){path.reset();path.moveTo(point[0],point[1]-3);path.lineTo(point[0]+3,point[1]);path.lineTo(point[0],point[1]+3);path.lineTo(point[0]-3,point[1]);path.close();canvas.drawPath(path,p);}
            }canvas.restoreToCount(save);
        }
    }
}
