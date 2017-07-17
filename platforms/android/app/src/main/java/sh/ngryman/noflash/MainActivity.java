package sh.ngryman.noflash;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.graphics.Rect;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;

import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends Activity {
	private WebView webView;
	private int oldHeightDiff = 0;

	@Override
	@SuppressLint("SetJavaScriptEnabled")
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		webView = (WebView) findViewById(R.id.webView);

		WebSettings settings = webView.getSettings();
		settings.setJavaScriptEnabled(true);
		settings.setDomStorageEnabled(true);
		settings.setDatabaseEnabled(true);
		settings.setAllowUniversalAccessFromFileURLs(true);

		webView.addJavascriptInterface(new NoFlashInterface(this), "Native");
		webView.loadUrl("file:///android_asset/index.html");
	}

	@Override
	protected void onPostCreate(@Nullable Bundle savedInstanceState) {
		super.onPostCreate(savedInstanceState);

		setFullscreen(true);

		final ViewTreeObserver observer = webView.getViewTreeObserver();
		observer.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
			@Override
			public void onGlobalLayout() {
				Rect r = new Rect();
				webView.getWindowVisibleDisplayFrame(r);
				int heightDiff = webView.getRootView().getHeight() - (r.bottom - r.top);

				if (oldHeightDiff <= 150 && heightDiff <= 150) return;

				float density = getResources().getDisplayMetrics().density;
				JSONObject detail = new JSONObject();

				try {
					detail.put("offset", heightDiff / density);
				}
				catch (JSONException e) {
					e.printStackTrace();
				}

				if (heightDiff <= 150) {
					dispatchJSEvent("keyboardhidden", detail);
					setFullscreen(true);
				}
				else {
					dispatchJSEvent("keyboardshown", detail);
				}

				oldHeightDiff = heightDiff;
			}
		});
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if ((keyCode == KeyEvent.KEYCODE_BACK) && webView.canGoBack()) {
			webView.goBack();
			return true;
		}
		return super.onKeyDown(keyCode, event);
	}

	private void dispatchJSEvent(String eventName, JSONObject detail) {
		String source =
			"console.log('event', '" + eventName + "');" +
			"var event = new CustomEvent('" + eventName + "', { detail: " + detail.toString() + " });" +
			"document.body.dispatchEvent(event);";

		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
			webView.evaluateJavascript(source, null);
		}
		else {
			webView.loadUrl("javascript:" + source);
		}
	}

	public void setFullscreen(boolean toggle) {
		if (toggle) {
			getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
			getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);

			// Note that some of these constants are new as of API 16 (Jelly Bean)
			// and API 19 (KitKat). It is safe to use them, as they are inlined
			// at compile-time and do nothing on earlier devices.
			webView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LOW_PROFILE
				| View.SYSTEM_UI_FLAG_FULLSCREEN
				| View.SYSTEM_UI_FLAG_LAYOUT_STABLE
				| View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
				| View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
				| View.SYSTEM_UI_FLAG_HIDE_NAVIGATION);
		}
		else {
			getWindow().addFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
			getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);

			webView.setSystemUiVisibility(
				View.SYSTEM_UI_FLAG_VISIBLE
			);
		}
	}
}
