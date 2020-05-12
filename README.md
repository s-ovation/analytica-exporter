# AnalyticaExporter

Analyticaに登録されているクエリ/加工一覧をJSONファイルにエクスポートするツールです。
クエリについては、それぞれのクエリに登録されているSQLも出力します。

## 使い方

コマンド中の、xxxxxは、利用しているAnalyticaアカウントのグループ名、メールアドレス、パスワードに置き換えてください。

### クエリの出力
```
$ npm run start query --groupName xxxxx --email xxxxx --password xxxxx
```

`analytica_queries.json`　にエクスポート結果が出力されます。

### 加工の出力
```
$ npm run start transform --groupName xxxxx --email xxxxx --password xxxxx
```

`analytica_transforms.json`　にエクスポート結果が出力されます。

## インストール

```
$ npm install
```

## ライセンス

MIT