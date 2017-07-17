package sh.ngryman.noflash;

import android.content.Context;
import android.media.MediaPlayer;
import android.webkit.JavascriptInterface;

class NoFlashInterface {
	private MediaPlayer spellSound;

	NoFlashInterface(Context context) {
		spellSound = MediaPlayer.create(context, R.raw.spell);
	}

	@JavascriptInterface
	public void notifyAvailableSpell() {
		spellSound.start();
	}
}
