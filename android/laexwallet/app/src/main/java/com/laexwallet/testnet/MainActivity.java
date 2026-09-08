package com.laexwallet.testnet;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.KeyguardManager;
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
    private LocalVault vault;
    private SharedPreferences prefs;
    private final TestnetRpc rpc=new TestnetRpc();
    private final ExecutorService worker=Executors.newSingleThreadExecutor();
    private volatile long epoch=0;
    private volatile boolean visible=false;
    private boolean unlocked=false,authenticating=false,busy=false,authenticationAccepted=false;
    private Runnable afterAuthentication;
    private byte[] importEntropy;
    private String address="",backupPhrase="";
    private WalletCore.Draft draft;
    private BigInteger balance=null;

    @Override public void onCreate(Bundle saved){
        super.onCreate(saved);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
        vault=new LocalVault(this);prefs=getSharedPreferences("testnet-public-data",MODE_PRIVATE);
        address=prefs.getString("address","");
        root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setBackgroundColor(bg);
        root.setOnApplyWindowInsetsListener((v,insets)->{android.graphics.Insets bars=insets.getInsets(android.view.WindowInsets.Type.systemBars()|android.view.WindowInsets.Type.ime());v.setPadding(bars.left,bars.top,bars.right,bars.bottom);return insets;});
        setContentView(root);locked();
    }
    @Override public void onStart(){super.onStart();visible=true;}
    @Override public void onStop(){
        visible=false;epoch++;unlocked=false;busy=false;backupPhrase="";balance=null;
        if(!authenticating){draft=null;wipeImport();}
        locked();super.onStop();
    }
    @Override public void onDestroy(){worker.shutdownNow();wipeImport();super.onDestroy();}
    @Override public void onBackPressed(){if(unlocked){draft=null;backupPhrase="";home();}else super.onBackPressed();}
    private int dp(int value){return Math.round(value*getResources().getDisplayMetrics().density);}
    private GradientDrawable box(int color){GradientDrawable d=new GradientDrawable();d.setColor(color);d.setCornerRadius(dp(17));return d;}
    private TextView label(String value,int size,int color){TextView t=new TextView(this);t.setText(value);t.setTextColor(color);t.setTextSize(size);t.setLineSpacing(dp(4),1);t.setPadding(0,dp(7),0,dp(7));return t;}
    private void screen(String title,String subtitle){
        root.removeAllViews();
        LinearLayout header=new LinearLayout(this);header.setGravity(Gravity.CENTER_VERTICAL);header.setPadding(dp(20),dp(10),dp(20),dp(8));
        header.addView(new LogoView(),new LinearLayout.LayoutParams(dp(38),dp(38)));
        TextView brand=label("  laexWallet",24,text);brand.setTypeface(null,Typeface.BOLD);header.addView(brand,new LinearLayout.LayoutParams(0,-2,1));
        TextView tag=label("PRUEBAS",11,mint);header.addView(tag);root.addView(header);
        TextView banner=label("BNB TESTNET · MONEDAS SIN VALOR",12,mint);banner.setGravity(Gravity.CENTER);root.addView(banner);
        ScrollView scroll=new ScrollView(this);scroll.setFillViewport(true);root.addView(scroll,new LinearLayout.LayoutParams(-1,0,1));
        body=new LinearLayout(this);body.setOrientation(LinearLayout.VERTICAL);body.setPadding(dp(22),dp(12),dp(22),dp(28));scroll.addView(body);
        TextView h=label(title,29,text);h.setTypeface(null,Typeface.BOLD);h.setAccessibilityHeading(true);body.addView(h);
        if(!subtitle.isEmpty())body.addView(label(subtitle,17,muted));
    }
    private void note(String value){TextView t=label(value,16,muted);t.setBackground(box(surface));t.setPadding(dp(15),dp(14),dp(15),dp(14));LinearLayout.LayoutParams lp=new LinearLayout.LayoutParams(-1,-2);lp.setMargins(0,dp(14),0,dp(10));body.addView(t,lp);}
    private Button button(String title,Runnable action,boolean primary){Button b=new Button(this);b.setText(title);b.setTextSize(16);b.setAllCaps(false);b.setTypeface(null,Typeface.BOLD);b.setTextColor(primary?bg:text);b.setBackground(box(primary?mint:surface));b.setPadding(dp(12),dp(12),dp(12),dp(12));b.setMinHeight(dp(54));LinearLayout.LayoutParams lp=new LinearLayout.LayoutParams(-1,-2);lp.setMargins(0,dp(13),0,0);body.addView(b,lp);b.setOnClickListener(v->{if(!busy)action.run();});return b;}
    private EditText field(String title,int input){body.addView(label(title,16,text));EditText e=new EditText(this);e.setTextSize(17);e.setTextColor(text);e.setHintTextColor(muted);e.setBackground(box(surface));e.setPadding(dp(14),dp(12),dp(14),dp(12));e.setInputType(input);e.setImportantForAutofill(View.IMPORTANT_FOR_AUTOFILL_NO_EXCLUDE_DESCENDANTS);e.setSaveEnabled(false);body.addView(e,new LinearLayout.LayoutParams(-1,-2));return e;}
    private void failure(String message){if(!visible)return;AlertDialog.Builder dialog=new AlertDialog.Builder(this).setTitle("Revisa este paso").setMessage(message).setPositiveButton("Entendido",null);if(message.contains("LW-101"))dialog.setNeutralButton("Copiar código",(d,w)->getSystemService(ClipboardManager.class).setPrimaryClip(ClipData.newPlainText("Diagnóstico laexWallet",message.substring(message.indexOf("LW-101")))));dialog.show();}
    private String safeError(Throwable error){if(error instanceof LinkageError)return "La app encontró una incompatibilidad al preparar la cuenta. No uses Recuperar para crear una cuenta nueva. Comparte solo este código de diagnóstico:\n\n"+OperationResult.diagnostic(error);if(error instanceof IllegalArgumentException||error instanceof IllegalStateException)return error.getMessage();if(error instanceof android.security.keystore.UserNotAuthenticatedException)return "Vuelve a desbloquear con el PIN del teléfono e inténtalo de nuevo.";return "No se pudo completar el paso. Comprueba tu conexión y el bloqueo de pantalla. Si ya intentaste enviar, revisa el historial antes de repetir.";}
    private void authorize(Runnable action){
        KeyguardManager keyguard=getSystemService(KeyguardManager.class);
        if(!keyguard.isDeviceSecure()){failure("Configura primero un PIN, patrón o contraseña de bloqueo en los ajustes de tu Samsung. La wallet lo necesita para proteger el acceso.");return;}
        afterAuthentication=action;authenticating=true;
        Intent intent=keyguard.createConfirmDeviceCredentialIntent("laexWallet · Pruebas","Confirma tu identidad con el bloqueo de tu teléfono.");
        if(intent==null){authenticating=false;afterAuthentication=null;failure("No se pudo abrir la comprobación del teléfono.");return;}
        startActivityForResult(intent,97);
    }
    @Override protected void onActivityResult(int request,int result,Intent data){
        super.onActivityResult(request,result,data);if(request!=97)return;
        authenticationAccepted=result==RESULT_OK&&afterAuthentication!=null;
        if(!authenticationAccepted){authenticating=false;afterAuthentication=null;draft=null;wipeImport();locked();}
    }
    @Override protected void onPostResume(){
        super.onPostResume();visible=true;
        if(!authenticationAccepted)return;
        authenticationAccepted=false;authenticating=false;
        Runnable action=afterAuthentication;afterAuthentication=null;
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
    private void locked(){screen(vault.exists()?"Tu wallet, en privado":"Tu wallet. Tu control.","Primera versión Android de pruebas. Usa solo cuentas y monedas de testnet, nunca un respaldo con fondos reales.");
        if(vault.exists())button("Desbloquear wallet",()->authorize(()->task("Abriendo tu wallet",()->{byte[] entropy=vault.read();try{return WalletCore.address(entropy);}finally{Arrays.fill(entropy,(byte)0);}},value->{address=value;prefs.edit().putString("address",address).commit();home();})),true);
        else {button("Crear wallet de prueba",()->authorize(this::create),true);button("Recuperar wallet de prueba",()->authorize(this::restore),false);}
        note("Este APK solo firma para BNB testnet (97). OMDB, OMD, intercambios y Web3 no están habilitados aquí. No envíes fondos reales.");
    }
    private void create(){task("Creando tu cuenta",()->{byte[] entropy=WalletCore.newEntropy();try{String value=WalletCore.address(entropy);vault.save(entropy);return value;}finally{Arrays.fill(entropy,(byte)0);}},value->{address=value;prefs.edit().putString("address",value).putBoolean("backup",false).commit();showBackup();});}
    private void showBackup(){task("Preparando tu respaldo",()->{byte[] entropy=vault.read();try{return WalletCore.words(entropy);}finally{Arrays.fill(entropy,(byte)0);}},phrase->{backupPhrase=phrase;screen("Anota tus 12 palabras","Son el respaldo de esta cuenta de prueba. Escríbelas en papel y conserva su orden. Nunca las compartas, ni con LAEX.");String[] words=phrase.split(" ");for(int i=0;i<words.length;i++)body.addView(label(String.format(java.util.Locale.ROOT,"%02d   %s",i+1,words[i]),19,mint));note("No hay botón de copiar. Las capturas están bloqueadas. Este respaldo corresponde solo a tu cuenta de pruebas.");button("Ya las anoté: comprobar",this::checkBackup,true);button("Guardar para después",()->{backupPhrase="";home();},false);});}
    private void checkBackup(){String[] words=backupPhrase.split(" ");if(words.length!=12){home();return;}screen("Comprueba tu respaldo","Escribe las palabras indicadas mirando tu papel.");EditText a=field("Palabra 1",InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS),b=field("Palabra 6",InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS),c=field("Palabra 12",InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);button("Verificar respaldo",()->{if(!a.getText().toString().trim().equals(words[0])||!b.getText().toString().trim().equals(words[5])||!c.getText().toString().trim().equals(words[11])){failure("Las palabras no coinciden. Revisa tu papel y su orden.");return;}prefs.edit().putBoolean("backup",true).commit();backupPhrase="";home();},true);}
    private void restore(){screen("Recuperar cuenta de prueba","Usa únicamente una frase creada para pruebas. Nunca introduzcas aquí la frase de una wallet con dinero real.");EditText phrase=field("Tus 12 palabras de prueba",InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD|InputType.TYPE_TEXT_FLAG_MULTI_LINE|InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);phrase.setMinLines(3);CheckBox check=new CheckBox(this);check.setText("Confirmo que este respaldo es solo de pruebas");check.setTextColor(text);check.setTextSize(16);body.addView(check);button("Recuperar en este teléfono",()->{if(!check.isChecked()){failure("Confirma que usarás un respaldo de pruebas.");return;}try{importEntropy=WalletCore.entropy(phrase.getText().toString());phrase.setText("");authorize(()->task("Recuperando tu cuenta",()->{try{String value=WalletCore.address(importEntropy);vault.save(importEntropy);return value;}finally{wipeImport();}},value->{address=value;prefs.edit().putString("address",value).putBoolean("backup",true).commit();home();}));}catch(Exception e){wipeImport();failure(safeError(e));}},true);button("Volver",this::locked,false);}
    private void home(){if(!unlocked){locked();return;}screen("Mi wallet de prueba","BNB Smart Chain · Testnet 97");
        LinearLayout card=new LinearLayout(this);card.setOrientation(LinearLayout.VERTICAL);card.setBackground(box(mint));card.setPadding(dp(18),dp(13),dp(18),dp(13));card.addView(label("Saldo consultado en la red",14,bg));card.addView(label(balance==null?"Sin consultar":WalletCore.format(balance)+" tBNB",29,bg));card.addView(label("Sin valor económico",13,bg));body.addView(card);
        if(!prefs.getBoolean("backup",false)){note("Completa tu respaldo antes de enviar. Si pierdes el teléfono, LAEX no podrá recuperar tu cuenta.");button("Anotar y verificar respaldo",()->authorize(this::showBackup),true);}
        button("Actualizar saldo",()->task("Consultando BNB testnet",()->rpc.balance(address),value->{balance=value;home();}),false);
        button("Recibir tBNB",this::receive,true);button("Enviar tBNB",()->{if(!prefs.getBoolean("backup",false)){failure("Primero anota y verifica tu respaldo.");return;}if(!prefs.getString("pending","").isEmpty()){history();return;}send();},false);
        button("Actividad y estado del envío",this::history,false);button("Seguridad y ayuda",this::security,false);
    }
    private void receive(){screen("Recibir tBNB","Comparte esta dirección solo para recibir BNB de testnet (97). Una dirección EVM también puede existir en otras redes: comprueba siempre la red del envío.");
        try{var matrix=new MultiFormatWriter().encode("ethereum:"+address+"@97",BarcodeFormat.QR_CODE,600,600);Bitmap image=Bitmap.createBitmap(600,600,Bitmap.Config.RGB_565);for(int x=0;x<600;x++)for(int y=0;y<600;y++)image.setPixel(x,y,matrix.get(x,y)?Color.BLACK:Color.WHITE);ImageView qr=new ImageView(this);qr.setImageBitmap(image);qr.setContentDescription("QR de tu dirección en BNB testnet 97");LinearLayout.LayoutParams size=new LinearLayout.LayoutParams(dp(230),dp(230));size.gravity=Gravity.CENTER;size.setMargins(0,dp(15),0,dp(15));body.addView(qr,size);}catch(Exception e){note("No se pudo dibujar el QR. Usa la dirección escrita.");}
        TextView value=label(address,16,mint);value.setTextIsSelectable(true);body.addView(value);
        button("Copiar dirección de prueba",()->{getSystemService(ClipboardManager.class).setPrimaryClip(ClipData.newPlainText("Dirección BNB testnet 97",address));android.widget.Toast.makeText(this,"Dirección copiada",android.widget.Toast.LENGTH_SHORT).show();},true);
        button("Abrir faucet oficial de pruebas",()->open(WalletCore.FAUCET),false);note("El faucet es un sitio externo y puede tener requisitos o límites. No necesitas comprar tBNB. Al regresar tendrás que desbloquear la wallet.");button("Volver a mi wallet",this::home,false);
    }
    private void send(){screen("Enviar monedas de prueba","Solo tBNB en BNB testnet. En este piloto no se envía a contratos y el máximo es 1 tBNB por operación.");EditText to=field("Dirección de otra cuenta de prueba",InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);EditText amount=field("Cantidad de tBNB",InputType.TYPE_CLASS_NUMBER|InputType.TYPE_NUMBER_FLAG_DECIMAL);button("Revisar envío",()->{String recipient=to.getText().toString(),value=amount.getText().toString();task("Preparando el envío",()->rpc.prepare(address,recipient,value),result->{draft=result;review();});},true);button("Cancelar",this::home,false);}
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
    private void history(){screen("Actividad de esta instalación","Una respuesta lenta no significa que el envío haya fallado. Comprueba el hash antes de repetir.");
        try{JSONArray entries=new JSONArray(prefs.getString("history","[]"));if(entries.length()==0)note("Todavía no hay envíos desde esta aplicación. Los depósitos externos se reflejan al actualizar el saldo; el explorador muestra el historial completo.");for(int i=0;i<entries.length();i++){JSONObject item=entries.getJSONObject(i);String hash=item.getString("hash");note(item.getString("value")+" tBNB\nPara: "+item.getString("to")+"\n"+item.getString("status")+"\n"+hash);button("Consultar estado "+(i+1),()->task("Consultando el recibo",()->rpc.status(hash),status->{JSONArray current=new JSONArray(prefs.getString("history","[]"));for(int j=0;j<current.length();j++)if(current.getJSONObject(j).getString("hash").equals(hash))current.getJSONObject(j).put("status",status);SharedPreferences.Editor editor=prefs.edit().putString("history",current.toString());if(hash.equals(prefs.getString("pending",""))&&(status.startsWith("Confirmada")||status.startsWith("Fallida")))editor.remove("pending");editor.commit();history();}),false);button("Ver transacción "+(i+1),()->open(WalletCore.EXPLORER+"/tx/"+hash),false);}}catch(Exception e){note("No se pudo leer el historial local. No repitas un envío sin comprobarlo en el explorador.");}
        button("Ver cuenta en explorador testnet",()->open(WalletCore.EXPLORER+"/address/"+address),false);button("Volver a mi wallet",this::home,true);
    }
    private void security(){screen("Tu seguridad, primero","Versión 0.1.1-testnet · Piloto sin auditoría independiente.");note("• Entropía cifrada con AES-GCM y Android Keystore.\n• El desbloqueo utiliza el PIN, patrón o contraseña del teléfono.\n• La app se bloquea al pasar a segundo plano.\n• Copias del sistema y capturas desactivadas.\n• Solo firma para Chain ID 97.\n• No hay analítica ni envío de frases a servidores LAEX.");button("Ver respaldo de prueba",()->authorize(this::showBackup),false);note("El RPC puede observar tu IP y las direcciones consultadas. El respaldo se deriva mediante BIP39/BIP44, ruta m/44'/60'/0'/0/0, sin contraseña adicional BIP39. Nunca uses aquí una frase con fondos reales.");button("Bloquear ahora",()->{unlocked=false;draft=null;backupPhrase="";locked();},true);button("Volver",this::home,false);}
    private void open(String url){try{startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse(url)));}catch(Exception e){failure("No se encontró un navegador para abrir el enlace.");}}
    private final class LogoView extends View{
        private final Bitmap bitmap;
        LogoView(){super(MainActivity.this);bitmap=BitmapFactory.decodeResource(getResources(),R.drawable.wallet_logo);setContentDescription("Logo laexWallet");}
        @Override protected void onDraw(Canvas canvas){super.onDraw(canvas);if(bitmap!=null)canvas.drawBitmap(bitmap,new Rect((int)(bitmap.getWidth()*.24),(int)(bitmap.getHeight()*.145),(int)(bitmap.getWidth()*.75),(int)(bitmap.getHeight()*.66)),new RectF(0,0,getWidth(),getHeight()),new android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG|android.graphics.Paint.FILTER_BITMAP_FLAG));}
    }
}
