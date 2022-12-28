synth:
	npx cdk synth

build: 
	npm run build

deploy:
	cdk deploy

clean:
	rm -rf bin/*.js
	rm -rf bin/*.d.ts
	rm -rf lib/*.js
	rm -rf lib/*.d.ts
	rm -rf cdk.out/