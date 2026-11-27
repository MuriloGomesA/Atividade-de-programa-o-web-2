BASE=http://localhost:3000/api
JAR=cookies.txt

curl -X POST $BASE/auth/register -H "Content-Type: application/json" -d '{"email":"aluno@uncisal.edu.br","senha":"123456"}'
curl -X POST $BASE/auth/register -H "Content-Type: application/json" -d '{"email":"xxx","senha":"123456"}'
curl -X POST $BASE/auth/login -H "Content-Type: application/json" -d '{"email":"aluno@uncisal.edu.br","senha":"errada"}'
curl -i $BASE/tarefas
curl -c $JAR -X POST $BASE/auth/login -H "Content-Type: application/json" -d '{"email":"aluno@uncisal.edu.br","senha":"123456"}'
curl -b $JAR $BASE/auth/me
curl -b $JAR $BASE/tarefas
curl -b $JAR -X POST $BASE/tarefas -H "Content-Type: application/json" -d '{"titulo":"Estudar JWT","descricao":"Cookies e guards"}'
curl -b $JAR -c $JAR -X POST $BASE/auth/logout
curl -i -b $JAR $BASE/auth/me
