# Trabalho Prático - Interface Pessoa-Máquina  

Universidade do Minho 

(Ano letivo 2024/2025)


### Objetivo do Trabalho Prático

Em cursos de grande dimensão, como é o caso da Licenciatura em Engenharia In-
formática (LEI), os alunos têm de ser distribuídos por turnos para viabilizar a realização
das aulas. A gestão dessa distribuição por turnos é um processo complexo, uma vez
que é necessário compatibilizar os turnos das diferentes Unidades Curriculares (UC)
de cada ano do curso (e, eventualmente, de diferentes anos do curso), de modo a
que os alunos não tenham colisões no seu horário.
Historicamente, os docentes de cada UC geriam a definição dos turnos da sua
UC. Esta solução mostrou não ser escalável, criando situações em que os alunos
tinham dificuldades em obter horários sem colisões e atrasando o início das aulas.
Uma forma de facilitar o processo é centralizar a criação dos turnos nas direções
de curso. No entanto, essa criação é complexa e demorada, consumindo recursos,
pelo que só é viável se as listas de inscritos forem conhecidas com antecedência
suficiente, o que nem sempre acontece (por exemplo, no primeiro semestre do ano).
Além disso, tem as suas próprias desvantagens, uma vez que não permite aos alunos
controlo sobre o seu horário.
Neste projeto é-lhe pedido que conceba e implemente a interface de utilizador
de um sistema para auxiliar o diretor de curso na gestão dos turnos práticos de um
semestre de um curso. Para efeitos deste trabalho, assume-se que são conhecidas
as UC de cada ano do curso nesse semestre, o horário do curso e as listas de inscritos
a cada UC, bem como uma primeira distribuição dos alunos por turnos.

### Setup ⚙️

Criar projeto Vue.js.


```text
npm create vue@latest
```

Inserir nome do projeto, nome do pacote e selecionar features a incluir no projeto.

Mover para a diretoria MySchedule.

```text
cd MySchedule
```

Instalar dependências do projeto.
```text
npm install
```


Iniciar o servidor de desenvolvimento e executar o projeto localmente.
```text
npm run dev
```

Antes de iniciar o servidor de desenvolvimento, deve-se correr o json-server dentro da diretoria database. 
```text
npx json-server trabalhodb.json
```



### Informação Adicional

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/uYlAcSPA)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=18877585)
