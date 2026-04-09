.PHONY: dev link build publish update

link:
	@echo "🔗 Linking backend port 8080..."
	adb reverse tcp:8080 tcp:8080

dev: link
	@echo "🚀 Starting Expo..."
	pnpm run android:usb

build:
	eas build --platform android --profile preview

publish:
	eas update --branch production

update:
	eas update --branch production --message "$(m)"