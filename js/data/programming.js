/* Задачи по программированию (JS/Python) */

const PROG_TASKS = {
  beginner: [
    {
      q: "Что выведет этот код?",
      code: "console.log(2 + '2');",
      opts: ["4", "22", "NaN", "Ошибка"],
      correct: 1,
      hint: "Оператор + складывает числа, но если один из операндов — строка, происходит конкатенация"
    },
    {
      q: "Что выведет этот код?",
      code: "typeof null",
      opts: ["'null'", "'object'", "'undefined'", "'number'"],
      correct: 1,
      hint: "Это известная особенность JS, typeof null возвращает 'object' с самого начала"
    },
    {
      q: "Что выведет этот код?",
      code: "[1,2,3].length",
      opts: ["2", "3", "4", "Error"],
      correct: 1,
      hint: "length возвращает размер массива"
    },
    {
      q: "Что выведет этот код?",
      code: "console.log(!!'hello');",
      opts: ["true", "false", "'hello'", "1"],
      correct: 0,
      hint: "Двойное отрицание приводит значение к boolean"
    },
    {
      q: "Что выведет этот код?",
      code: "console.log(0.1 + 0.2 === 0.3);",
      opts: ["true", "false", "NaN", "TypeError"],
      correct: 1,
      hint: "Числа с плавающей точкой имеют ограниченную точность"
    },
    {
      q: "Что выведет этот код?",
      code: "const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);",
      opts: ["3", "4", "5", "Error"],
      correct: 1,
      hint: "push добавляет элемент в конец массива"
    },
    {
      q: "Что выведет этот код?",
      code: "console.log('5' - 3);",
      opts: ["'53'", "2", "NaN", "Error"],
      correct: 1,
      hint: "Оператор - приводит строку к числу (в отличие от +)"
    },
    {
      q: "Какой тип у значения Infinity?",
      code: "typeof Infinity",
      opts: ["'string'", "'infinity'", "'number'", "'undefined'"],
      correct: 2,
      hint: "Infinity — это специальное числовое значение в JS"
    },
    {
      q: "Что делает метод Array.isArray()?",
      code: "Array.isArray([1,2,3])",
      opts: ["Возвращает длину", "Возвращает true", "Бросает ошибку", "Возвращает undefined"],
      correct: 1,
      hint: "Метод проверяет, является ли значение массивом"
    },
    {
      q: "Что выведет этот код?",
      code: "let x = 5;\nx += '3';\nconsole.log(typeof x);",
      opts: ["'number'", "'string'", "'undefined'", "Ошибка"],
      correct: 1,
      hint: "+= со строкой приводит к конкатенации"
    }
  ],
  intermediate: [
    {
      q: "Что выведет этот код?",
      code: "const a = [1, 2, 3];\nconst b = a;\nb.push(4);\nconsole.log(a.length);",
      opts: ["3", "4", "5", "undefined"],
      correct: 1,
      hint: "Массив — это ссылочный тип, b и a указывают на один массив"
    },
    {
      q: "Что выведет этот код?",
      code: "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}",
      opts: ["0 1 2", "3 3 3", "0 0 0", "Ошибка"],
      correct: 1,
      hint: "var имеет function scope, к моменту выполнения setTimeout i уже равен 3"
    },
    {
      q: "Что выведет этот код?",
      code: "console.log(1 == '1');\nconsole.log(1 === '1');",
      opts: ["true, true", "true, false", "false, false", "true, undefined"],
      correct: 1,
      hint: "== приводит типы, === строгое сравнение"
    },
    {
      q: "Что делает метод Object.keys()?",
      code: "Object.keys({a:1, b:2})",
      opts: ["Возвращает значения", "Возвращает массив ключей", "Считает ключи", "Удаляет ключи"],
      correct: 1,
      hint: "Object.keys возвращает массив строк — ключей объекта"
    },
    {
      q: "Что выведет этот код?",
      code: "const fn = () => {\n  return\n    { value: 42 };\n};\nconsole.log(fn());",
      opts: ["{value: 42}", "undefined", "null", "Ошибка"],
      correct: 1,
      hint: "return без значения возвращает undefined, точка с запятой ставится автоматически"
    },
    {
      q: "Чем отличается let от const?",
      code: "let a = 1; a = 2; // ?\nconst b = 1; b = 2; // ?",
      opts: ["Они одинаковы", "let можно менять, const нельзя", "const можно менять", "Оба вызовут ошибку"],
      correct: 1,
      hint: "const создаёт константу — привязку нельзя переназначить"
    },
    {
      q: "Что выведет этот код?",
      code: "JSON.stringify({a: undefined, b: null})",
      opts: ["'{\"a\":null,\"b\":null}'", "'{\"b\":null}'", "'{}'", "Ошибка"],
      correct: 1,
      hint: "undefined значения игнорируются в JSON.stringify"
    },
    {
      q: "Что вернёт Promise.resolve(42).then(v => v * 2)?",
      code: "Promise.resolve(42).then(v => v * 2)",
      opts: ["42", "Promise со значением 84", "Ошибка", "undefined"],
      correct: 1,
      hint: ".then возвращает новый Promise"
    },
    {
      q: "Что делает оператор ??",
      code: "null ?? 'default'",
      opts: ["Бросает ошибку", "Возвращает 'default'", "Возвращает null", "Возвращает 0"],
      correct: 1,
      hint: "Nullish coalescing: возвращает правое значение, если левое — null/undefined"
    },
    {
      q: "Что выведет этот код?",
      code: "[1, 2, 3].map(n => n * 2).filter(n => n > 2)",
      opts: ["[2, 4, 6]", "[4, 6]", "[3, 4, 5]", "[]"],
      correct: 1,
      hint: "map умножает, filter оставляет только > 2"
    }
  ],
  advanced: [
    {
      q: "Что выведет этот код?",
      code: "function f() {\n  console.log(this);\n}\nf.call(null);",
      opts: ["null", "window / globalThis", "undefined", "Ошибка"],
      correct: 1,
      hint: "В строгом режиме — null, без — глобальный объект. У нас нестрогий."
    },
    {
      q: "Что выведет этот код?",
      code: "const obj = {\n  value: 42,\n  get: () => this.value\n};\nconsole.log(obj.get());",
      opts: ["42", "undefined", "null", "Ошибка"],
      correct: 1,
      hint: "Стрелочная функция не имеет своего this, берёт из внешнего scope"
    },
    {
      q: "Что выведет этот код?",
      code: "async function f() {\n  return 1;\n}\nconsole.log(f());",
      opts: ["1", "Promise { 1 }", "Promise { <pending> }", "Ошибка"],
      correct: 1,
      hint: "async функция всегда возвращает Promise"
    },
    {
      q: "Что делает Symbol()?",
      code: "const s = Symbol('id');",
      opts: ["Создаёт строку", "Создаёт уникальный идентификатор", "Создаёт число", "Бросает ошибку"],
      correct: 1,
      hint: "Symbol — уникальный и неизменяемый тип данных"
    },
    {
      q: "Что выведет этот код?",
      code: "console.log([...'hello']);",
      opts: ["['hello']", "['h','e','l','l','o']", "['h', 'el', 'l', 'o']", "Ошибка"],
      correct: 1,
      hint: "Spread для строки разбивает её на символы"
    },
    {
      q: "Чем shallow copy отличается от deep copy?",
      code: "const a = {x: {y: 1}};\nconst b = {...a};\nb.x.y = 2;\nconsole.log(a.x.y);",
      opts: ["1", "2", "undefined", "Ошибка"],
      correct: 1,
      hint: "shallow copy копирует только верхний уровень, вложенные объекты общие"
    },
    {
      q: "Что такое замыкание (closure)?",
      code: "function outer() {\n  let n = 0;\n  return () => ++n;\n}\nconst inc = outer();\nconsole.log(inc(), inc());",
      opts: ["0, 1", "1, 2", "undefined", "Ошибка"],
      correct: 1,
      hint: "Замыкание сохраняет доступ к переменным внешней функции"
    }
  ]
};
