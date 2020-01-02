package com.parsempo.ImageCropTools

import android.graphics.Bitmap
import android.net.Uri
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.theartofdev.edmodo.cropper.CropImageView
import java.io.File
import java.util.*
import kotlin.math.abs

class ImageCropViewManager: SimpleViewManager<CropImageView>() {
    companion object {
        const val REACT_CLASS = "CropView"
        const val ON_IMAGE_SAVED = "onImageSaved"
        const val SOURCE_URL_PROP = "sourceUrl"
        const val KEEP_ASPECT_RATIO_PROP = "keepAspectRatio"
        const val ASPECT_RATIO_PROP = "cropAspectRatio"
        const val SAVE_IMAGE_COMMAND = 1
        const val SAVE_IMAGE_COMMAND_NAME = "saveImage"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): CropImageView {
        val view =  CropImageView(reactContext)
        view.setOnCropImageCompleteListener { _, result ->
            if (result.isSuccessful) {
                val map = Arguments.createMap()
                map.putString("uri", result.uri.toString())
                map.putInt("width", result.cropRect.width())
                map.putInt("height", result.cropRect.height())
                reactContext.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(
                        view.id,
                        ON_IMAGE_SAVED,
                        map
                )
            }
        }
        return view
    }

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
        return MapBuilder.of(
                ON_IMAGE_SAVED,
                MapBuilder.of("registrationName", ON_IMAGE_SAVED)
        )
    }

    override fun getCommandsMap(): MutableMap<String, Int> {
        return MapBuilder.of(SAVE_IMAGE_COMMAND_NAME, SAVE_IMAGE_COMMAND)
    }

    override fun receiveCommand(root: CropImageView, commandId: Int, args: ReadableArray?) {
        if (commandId == SAVE_IMAGE_COMMAND) {
            val path = File(root.context.cacheDir, "${UUID.randomUUID()}.jpg").toURI().toString()
            val quality = args?.getInt(0) ?: 100
            root.saveCroppedImageAsync(Uri.parse(path), Bitmap.CompressFormat.JPEG, quality)
        }
    }

    // Taken from StackOverflow
    private fun convertDecimalToFraction(x: Double): Pair<Int, Int> {
        val tolerance = 1.0E-6
        var h1 = 1.0
        var h2 = 0.0
        var k1 = 0.0
        var k2 = 1.0
        var b = x
        do {
            val a = Math.floor(b)
            var aux = h1
            h1 = a * h1 + h2
            h2 = aux
            aux = k1
            k1 = a * k1 + k2
            k2 = aux
            b = 1 / (b - a)
        } while (abs(x - h1 / k1) > x * tolerance)
        return Pair(h1.toInt(), k1.toInt())
    }

    @ReactProp(name = SOURCE_URL_PROP)
    fun setSourceUrl(view: CropImageView, url: String?) {
        url?.let {
            view.setImageUriAsync(Uri.parse(it))
        }
    }

    @ReactProp(name = KEEP_ASPECT_RATIO_PROP)
    fun setFixedAspectRatio(view: CropImageView, fixed: Boolean) {
        view.setFixedAspectRatio(fixed)
    }

    @ReactProp(name = ASPECT_RATIO_PROP)
    fun setAspectRatio(view: CropImageView, aspectRatio: Double) {
        val ratio = convertDecimalToFraction(aspectRatio)
        view.setAspectRatio(ratio.first, ratio.second)
    }
}