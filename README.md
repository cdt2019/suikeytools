# suikeytools
generate sui key mnemonic address and export excel file

# clone project
```
git clone https://github.com/cdt2019/suikeytools.git
```

# install dependencies
```
cd suikeytools
npm install
```

# build 
```
npm run build
```

# run generate
```
npm run start
or
node .\src\index.js
```

# specify generate arguments
* filepath: save key file path
* filename: key file name
* num: number of generate key

* --filepath=C:\Users\cxw\Desktop\
* --filename=sui_key.xlsx
* --num=20

```
node .\src\index.js --filepath=C:\Users\cxw\Desktop\ --filename=sui_key.xlsx --num=20
```
