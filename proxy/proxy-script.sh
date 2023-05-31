serverPort=$( echo $PORT )
domainFe $( echo $DOMAIN_FE )

sed -i "s|SERVER_PORT|$serverPort|g" default.conf
sed -i "s|DOMAIN_FE|$domainFe|g" default.conf
