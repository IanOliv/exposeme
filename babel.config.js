module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias:  {
      "@app/*": ["./src/app/*","./src/app/index.ts"],
      "@server/*": ["./src/server/*"],
      "@decorators/*": ["./src/decorators/*"],
      "@client/*": ["./src/client/*"],
      "@client": ["./src/client/index.ts"],
      "@store": [
        "./src/store/index.ts"],
      "@store/*": [
            "./src/store/*"
        ],
      "@types/*": ["./src/@types/*","./node_modules/@types/*"],
      "@types": ["./src/@types/index.d.ts"]
    }
    }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
