package sh.ngryman.noflash;

import android.content.Context;
import android.media.MediaPlayer;
import android.webkit.JavascriptInterface;

public class NoFlashInterface {
	private Context context;
	private MediaPlayer spellSound;

	NoFlashInterface(Context c) {
		context = c;
		spellSound = MediaPlayer.create(context, R.raw.spell);
	}

	@JavascriptInterface
	public void notifyAvailableSpell() {
		spellSound.start();
	}
}
