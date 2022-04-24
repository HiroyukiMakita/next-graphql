#! /bin/bash

# テスト用 DB app-test がない場合に作成し、ユーザーにグローバルレベル に権限を付与する
CREATE_DATABASE="CREATE DATABASE IF NOT EXISTS \`${TESTING_DATABASE}\`;"
mysql -u root -p${MYSQL_ROOT_PASSWORD} -D mysql -e "${CREATE_DATABASE}"
GRANT="GRANT ALL ON \`${TESTING_DATABASE}\`.* TO '${MYSQL_USER}'@'%';"
mysql -u root -p${MYSQL_ROOT_PASSWORD} -D ${TESTING_DATABASE} -e "${GRANT}"