package com.parsempo.ImageCropTools

import android.graphics.Bitmap
import android.net.Uri
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.canhub.cropper.CropImageView
import com.facebook.react.uimanager.events.RCTEventEmitter
import java.io.File
import java.util.*

class ImageCropViewManager: SimpleViewManager<CropImageView>() {
    companion object {
        const val REACT_CLASS = "CropView"
        const val ON_IMAGE_SAVED = "onImageSaved"
        const val SOURCE_URL_PROP = "sourceUrl"
        const val KEEP_ASPECT_RATIO_PROP = "keepAspectRatio"
        const val ASPECT_RATIO_PROP = "cropAspectRatio"
        const val SAVE_IMAGE_COMMAND = 1
        const val ROTATE_IMAGE_COMMAND = 2
        const val SAVE_IMAGE_COMMAND_NAME = "saveImage"
        const val ROTATE_IMAGE_COMMAND_NAME = "rotateImage"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): CropImageView {
        val view =  CropImageView(reactContext)
        view.setOnCropImageCompleteListener { _, result ->
            if (result.isSuccessful) {
                val map = Arguments.createMap()
                map.putString("uri", result.getUriFilePath(reactContext, true).toString())
                map.putInt("width", result.cropRect!!.width())
                map.putInt("height", result.cropRect!!.height())
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
        return MapBuilder.of(
                SAVE_IMAGE_COMMAND_NAME, SAVE_IMAGE_COMMAND,
                ROTATE_IMAGE_COMMAND_NAME, ROTATE_IMAGE_COMMAND
        )
    }

    override fun receiveCommand(root: CropImageView, commandId: Int, args: ReadableArray?) {
        when (commandId) {
            SAVE_IMAGE_COMMAND -> {
                val preserveTransparency = args?.getBoolean(0) ?: false
                var extension = "jpg"
                var format = Bitmap.CompressFormat.JPEG
                if (preserveTransparency && root.croppedImage!!.hasAlpha()) {
                    extension = "png"
                    format = Bitmap.CompressFormat.PNG
                }
                val path = File(root.context.cacheDir, "${UUID.randomUUID()}.$extension").toURI().toString()
                val quality = args?.getInt(1) ?: 100

                root.croppedImageAsync(format, quality, customOutputUri = Uri.parse(path))
            }
            ROTATE_IMAGE_COMMAND -> {
                val clockwise = args?.getBoolean(0) ?: true
                root.rotateImage(if (clockwise) 90 else -90)
            }
        }
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
    fun setAspectRatio(view: CropImageView, aspectRatio: ReadableMap?) {
        if (aspectRatio != null) {
            view.setAspectRatio(aspectRatio.getInt("width"), aspectRatio.getInt("height"))
        }else {
            view.clearAspectRatio()
        }
    }
}
