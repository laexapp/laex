package com.laexwallet.testnet;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.ScrollView;
import android.widget.TextView;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.Robolectric;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;
import org.robolectric.annotation.Config;
import org.robolectric.annotation.GraphicsMode;
import java.io.File;
import java.io.FileOutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.math.BigInteger;
import static org.junit.Assert.*;

/** Actual native layouts with public fixture data; never authenticates or opens a real vault. */
@RunWith(RobolectricTestRunner.class)
@Config(sdk=35,qualifiers="w393dp-h852dp-mdpi")
@GraphicsMode(GraphicsMode.Mode.NATIVE)
public class WalletLayoutTest {
    private void set(MainActivity app,String name,Object value)throws Exception{Field f=MainActivity.class.getDeclaredField(name);f.setAccessible(true);f.set(app,value);}
    private void route(MainActivity app,String name)throws Exception{Method method=MainActivity.class.getDeclaredMethod(name);method.setAccessible(true);method.invoke(app);}
    private View root(MainActivity app)throws Exception{Field field=MainActivity.class.getDeclaredField("root");field.setAccessible(true);return (View)field.get(app);}
    private void measure(View root,int width,int height){root.measure(View.MeasureSpec.makeMeasureSpec(width,View.MeasureSpec.EXACTLY),View.MeasureSpec.makeMeasureSpec(height,View.MeasureSpec.EXACTLY));root.layout(0,0,width,height);}
    private void image(View root,String name)throws Exception{
        File output=new File("build/reports/wallet-ui");assertTrue(output.isDirectory()||output.mkdirs());
        Bitmap bitmap=Bitmap.createBitmap(root.getWidth(),root.getHeight(),Bitmap.Config.ARGB_8888);root.draw(new Canvas(bitmap));
        try(FileOutputStream stream=new FileOutputStream(new File(output,name+".png"))){assertTrue(bitmap.compress(Bitmap.CompressFormat.PNG,100,stream));}
        bitmap.recycle();
    }
    private View text(View node,String value){
        if(node instanceof TextView&&((TextView)node).getText().toString().equals(value))return node;
        if(node instanceof ViewGroup){ViewGroup group=(ViewGroup)node;for(int i=0;i<group.getChildCount();i++){View found=text(group.getChildAt(i),value);if(found!=null)return found;}}
        return null;
    }
    private MainActivity fixture()throws Exception{
        MainActivity app=Robolectric.buildActivity(MainActivity.class).setup().get();
        app.getSharedPreferences("testnet-public-data",0).edit().putBoolean("backup",true).commit();
        set(app,"unlocked",true);set(app,"address","0x1111111111111111111111111111111111111111");set(app,"balance",BigInteger.ZERO);
        return app;
    }
    @Test public void homeAndReceiveRenderWithReachableNavigation()throws Exception{
        MainActivity app=fixture();route(app,"home");View root=root(app);measure(root,393,780);image(root,"home-393");
        assertNotNull(text(root,"Mi wallet"));assertNotNull(text(root,"Enviar"));assertNotNull(text(root,"Recibir"));
        ScrollView scroll=(ScrollView)((ViewGroup)root).getChildAt(2);
        assertTrue("Home should fit without scrolling at standard scale",scroll.getChildAt(0).getMeasuredHeight()<=scroll.getMeasuredHeight());
        assertTrue((app.getWindow().getAttributes().flags&WindowManager.LayoutParams.FLAG_SECURE)!=0);
        route(app,"receive");measure(root,393,780);image(root,"receive-393");assertNotNull(text(root,"Copiar mi dirección"));
        assertNotNull(text(root,"Inicio"));assertNotNull(text(root,"Seguridad"));
        assertTrue(text(root,"Copiar mi dirección").performClick());
        android.content.ClipboardManager clipboard=app.getSystemService(android.content.ClipboardManager.class);
        assertEquals("0x1111111111111111111111111111111111111111",clipboard.getPrimaryClip().getItemAt(0).getText().toString());
        assertTrue(((View)text(root,"Inicio").getParent()).performClick());
        assertNotNull(text(root,"Mi wallet"));
    }
    @Test @Config(qualifiers="w360dp-h800dp-mdpi") public void narrowScreenAndWelcomeRender()throws Exception{
        MainActivity app=fixture();route(app,"home");View root=root(app);measure(root,360,728);image(root,"home-360");
        set(app,"unlocked",false);route(app,"locked");measure(root,360,728);image(root,"welcome-360");
        assertNotNull(text(root,"Crear mi wallet de prueba"));
    }
    @Test public void enlargedTextKeepsActionsInScrollableContent()throws Exception{
        RuntimeEnvironment.setFontScale(1.3f);MainActivity app=fixture();route(app,"home");View root=root(app);measure(root,393,780);image(root,"home-large-text");
        assertNotNull(text(root,"Enviar"));assertNotNull(text(root,"Recibir"));assertNotNull(text(root,"Seguridad"));
        route(app,"receive");measure(root,393,780);image(root,"receive-large-text");assertNotNull(text(root,"Copiar mi dirección"));
    }
}
