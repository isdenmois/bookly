set dotenv-load
APK_PATH := "./android/app/build/outputs/apk/release/app-arm64-v8a-release.apk"

build-apk:
    rm -f {{APK_PATH}}
    cd android; ./gradlew assembleRelease \
        -Pandroid.injected.signing.store.file="$KEY_STORE_FILE" \
        -Pandroid.injected.signing.store.password="$KEY_PASSWORD" \
        -Pandroid.injected.signing.key.alias="$KEY_ALIAS" \
        -Pandroid.injected.signing.key.password="$KEY_PASSWORD"
    @just print-apk-size

print-apk-size:
    @echo "Apk size: $(stat -c%s {{APK_PATH}} | numfmt --to=iec)"

upload-apk:
  curl -i -X POST -H "Content-Type: multipart/form-data" -F "file=@{{APK_PATH}}" $SERVER_URL

android-deploy: build-apk upload-apk
