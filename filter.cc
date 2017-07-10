#include <nan.h>
#include <stdlib.h>
#include "SuperpoweredDecoder.h"
#include "SuperpoweredSimple.h"
#include "SuperpoweredFilter.h"


using namespace v8;


NAN_METHOD(filter) {
    if (info.Length() != 1) {
        Nan::ThrowError("Invalid arguments");
        return;
    }

    if (!info[0]->IsString()) {
        Nan::ThrowError("Argument must be a string");
        return;
    }

    // Parse first argument.
    v8::String::Utf8Value filename(info[0]->ToString());

    // Open the input file.
    SuperpoweredDecoder *decoder = new SuperpoweredDecoder();
    const char *openError = decoder->open((const char*)(*filename), false, 0, 0);
    if (openError) {
        delete decoder;
        Nan::ThrowError((std::string("Open error: ") + openError).c_str());
        return;
    };

    // Creating the filter.
    SuperpoweredFilter *filter = new SuperpoweredFilter(SuperpoweredFilter_Resonant_Lowpass, decoder->samplerate);
    filter->setResonantParameters(400.0f, 0.1f);
    filter->enable(true);

    // Create a buffer for the 16-bit integer samples coming from the decoder.
    short int *intBuffer = (short int *)malloc(decoder->samplesPerFrame * 2 * sizeof(short int) + 32768);
    // Create a buffer for the 32-bit floating point samples required by the effect.
    float *floatBuffer = (float *)malloc(decoder->samplesPerFrame * 2 * sizeof(float) + 32768);

    // Create buffer to hold all samples
    uint32_t size = decoder->durationSamples * 2 * sizeof(short int);  // size of sampleBuffer in bytes
    Local<ArrayBuffer> buffer = ArrayBuffer::New(Isolate::GetCurrent(), size);
    Local<Int16Array> arr = Int16Array::New(buffer, 0, decoder->durationSamples * 2);
    Nan::TypedArrayContents<int16_t> typedArrayContents(arr);
    int16_t* sampleBuffer = *typedArrayContents;

    int64_t count = 0;
    int retcode = SUPERPOWEREDDECODER_OK;

    // Process samples.
    while (true) {
        // Decode one frame. samplesDecoded will be overwritten with the actual decoded number of samples.
        unsigned int samplesDecoded = decoder->samplesPerFrame;
        retcode = decoder->decode(intBuffer, &samplesDecoded);
        if (retcode == SUPERPOWEREDDECODER_ERROR) break;
        if (samplesDecoded < 1) break; // finished all samples ??

        // Convert the decoded PCM samples from 16-bit integer to 32-bit floating point.
        SuperpoweredShortIntToFloat(intBuffer, floatBuffer, samplesDecoded);

        // Apply the effect.
        filter->process(floatBuffer, floatBuffer, samplesDecoded);

        // Convert the PCM samples from 32-bit floating point to 16-bit integer.
        SuperpoweredFloatToShortInt(floatBuffer, sampleBuffer + count * 2, samplesDecoded);
        count += samplesDecoded;
    };

    // Free memory.
    delete decoder;
    delete filter;
    free(intBuffer);
    free(floatBuffer);

    // Error checking.
    if (retcode != SUPERPOWEREDDECODER_EOF) {
        Nan::ThrowError((std::string("decoder error: ") + std::to_string(retcode)).c_str());
        return;
    }

    // Return samples.
    info.GetReturnValue().Set(arr);
}


NAN_MODULE_INIT(Initialize) {
    NAN_EXPORT(target, filter);
}


NODE_MODULE(addon, Initialize)