build:
	eas build --platform android --profile preview

publish:
	eas update --branch production

update:
	eas update --branch production --message "message"