synth:
	npx cdk synth

build: 
	npm run build

deploy:
	cdk deploy

destroy:
	cdk destroy
	aws secretsmanager delete-secret --force-delete-without-recovery --secret-id /path/to/secret1
	aws secretsmanager delete-secret --force-delete-without-recovery --secret-id /path/to/secret2

clean:
	rm -rf bin/*.js
	rm -rf bin/*.d.ts
	rm -rf lib/*.js
	rm -rf lib/*.d.ts
	rm -rf cdk.out/