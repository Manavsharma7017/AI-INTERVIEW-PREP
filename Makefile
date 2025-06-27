gen:
	@protoc \
		--proto_path=proto proto/a.proto \
		--go_out=backend/common --go_opt=paths=source_relative \
		--go-grpc_out=backend/common --go-grpc_opt=paths=source_relative

gen2:
	@python -m grpc_tools.protoc \
		-Iproto \
		--python_out=llmserver \
		--grpc_python_out=llmserver \
		proto/a.proto