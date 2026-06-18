const EXAM_DATE = new Date("2026-06-19T10:00:00+02:00");
const STORE_PREFIX = "psp-recovery-lab-v1:";

const topics = [
  {
    id: "streams",
    label: "Streams",
    tone: "green",
    exam: "Pipelines con filter, map, sorted, reduce, collect y Files.lines.",
    method: "Fuente -> intermedias -> terminal. Si no hay terminal, no pasa nada.",
  },
  {
    id: "method",
    label: "Method Reference",
    tone: "blue",
    exam: "Convertir lambdas simples en Clase::metodo, objeto::metodo o Clase::new.",
    method: "La lambda solo llama a un metodo y pasa parametros en el mismo orden.",
  },
  {
    id: "atomic",
    label: "AtomicReference",
    tone: "gold",
    exam: "Estados y objetos actualizados de forma atomica con set, getAndUpdate y compareAndSet.",
    method: "Objeto inmutable + AtomicReference + transicion atomica.",
  },
  {
    id: "concurrent",
    label: "Concurrent Collections",
    tone: "green",
    exam: "ConcurrentHashMap, compute, merge, newKeySet y CopyOnWriteArrayList.",
    method: "Dato compartido -> coleccion concurrente -> operacion atomica compuesta.",
  },
  {
    id: "socket",
    label: "ServerSockets",
    tone: "red",
    exam: "Servidor, cliente, readers/writers, bucle accept y multithreading.",
    method: "ServerSocket -> accept -> Socket -> reader/writer -> cerrar recursos.",
  },
];

const studyPlan = [
  {
    id: "p1",
    slot: "Miercoles 17, 19:30-20:45",
    title: "Streams de examen",
    detail: "Haz 4 ejercicios: filter/map/sorted, reduce, Files.lines y refactor imperativo.",
  },
  {
    id: "p2",
    slot: "Miercoles 17, 21:00-22:00",
    title: "Method references sin mirar",
    detail: "Repite las 4 formas hasta escribirlas de memoria: static, objeto, primer parametro, constructor.",
  },
  {
    id: "p3",
    slot: "Miercoles 17, 22:10-23:00",
    title: "AtomicReference",
    detail: "Haz UserProfileUpdater y TaskState. Enfocate en compareAndSet.",
  },
  {
    id: "p4",
    slot: "Jueves 18, 09:30-11:30",
    title: "ConcurrentHashMap",
    detail: "Histograma, grupos de chat y reservas. Obligatorio usar merge o compute.",
  },
  {
    id: "p5",
    slot: "Jueves 18, 12:00-13:15",
    title: "ServerSocket base",
    detail: "Servidor Hola mundo, cliente, echo y version con hilos virtuales.",
  },
  {
    id: "p6",
    slot: "Jueves 18, 16:00-18:00",
    title: "Simulacro largo",
    detail: "Un ejercicio por tema, sin mirar soluciones. Corrige por estructura.",
  },
  {
    id: "p7",
    slot: "Jueves 18, 19:00-20:30",
    title: "Ataque a fallos",
    detail: "Rehaz solo lo que haya salido mal. Crea mini plantillas propias.",
  },
  {
    id: "p8",
    slot: "Viernes 19, 08:00-09:15",
    title: "Calentamiento",
    detail: "Escribe de memoria 5 esqueletos: stream, method ref, atomic, concurrent map y server.",
  },
];

const exercises = [
  {
    id: "streams-movies",
    topic: "streams",
    difficulty: "examen",
    title: "Peliculas: filtrar, ordenar y transformar",
    prompt:
      "Dado un Stream<Movie>, imprime los titulos de peliculas posteriores al 2000 con rating mayor o igual a 8.8, ordenadas por duracion descendente.",
    attack: [
      "No guardes el Stream si lo vas a reutilizar: crea la fuente justo antes del pipeline.",
      "Filtra por year y rating.",
      "Ordena con Comparator.comparing(Movie::duration).reversed().",
      "Mapea a title y termina con forEach(System.out::println) o toList().",
    ],
    starter: `import java.util.Comparator;
import java.util.stream.Stream;

record Movie(String title, int duration, double rating, int year) {}

public class Main {
    public static void main(String[] args) {
        Stream.of(
            new Movie("The Dark Knight", 152, 9.0, 2008),
            new Movie("Inception", 148, 8.8, 2010),
            new Movie("Interstellar", 169, 8.6, 2014)
        )
        // completa aqui
        ;
    }
}`,
    solution: `import java.util.Comparator;
import java.util.stream.Stream;

record Movie(String title, int duration, double rating, int year) {}

public class Main {
    public static void main(String[] args) {
        Stream.of(
            new Movie("The Dark Knight", 152, 9.0, 2008),
            new Movie("Inception", 148, 8.8, 2010),
            new Movie("Interstellar", 169, 8.6, 2014)
        )
        .filter(movie -> movie.year() > 2000)
        .filter(movie -> movie.rating() >= 8.8)
        .sorted(Comparator.comparing(Movie::duration).reversed())
        .map(Movie::title)
        .forEach(System.out::println);
    }
}`,
    required: [".filter(", ".sorted(", "Comparator.comparing", ".reversed(", ".map(", "forEach"],
    checklist: [
      "He usado dos filter o un filter con &&.",
      "El Comparator compara por duration, no por title.",
      "El pipeline termina con una operacion terminal.",
    ],
  },
  {
    id: "streams-files",
    topic: "streams",
    difficulty: "examen",
    title: "Fichero de estudiantes",
    prompt:
      "Lee entrada.txt con lineas nombre:nota. Elimina duplicados, ordena por nombre descendente, convierte el nombre a mayusculas y escribe salida.txt.",
    attack: [
      "Files.lines(Path.of(...)) ya te da Stream<String>.",
      "distinct elimina lineas repetidas completas.",
      "Para ordenar por nombre, divide por ':' dentro del comparator.",
      "Usa Files.write con una List<String> final.",
    ],
    starter: `import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;

public class Main {
    public static void main(String[] args) throws Exception {
        // lee, transforma y escribe
    }
}`,
    solution: `import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;

public class Main {
    public static void main(String[] args) throws Exception {
        List<String> salida = Files.lines(Path.of("entrada.txt"))
                .distinct()
                .sorted(Comparator.comparing((String line) -> line.split(":")[0]).reversed())
                .map(line -> {
                    String[] parts = line.split(":");
                    return parts[0].toUpperCase() + ":" + parts[1];
                })
                .toList();

        Files.write(Path.of("salida.txt"), salida);
    }
}`,
    required: ["Files.lines", "Path.of", ".distinct(", ".sorted(", "Comparator.comparing", ".map(", "Files.write"],
    checklist: [
      "No he intentado reutilizar el Stream despues de una terminal.",
      "El sorted ocurre antes de mapear a mayusculas o sigue comparando correctamente.",
      "El resultado final es List<String> para Files.write.",
    ],
  },
  {
    id: "streams-refactor",
    topic: "streams",
    difficulty: "base",
    title: "Imperativo a funcional",
    prompt:
      "Refactoriza: recorre una lista de nombres, quedate con los de longitud 4, conviertelos a mayusculas y guardalos en una lista.",
    attack: [
      "La lista es la fuente.",
      "El if pasa a filter.",
      "La asignacion transformadora pasa a map.",
      "El add a lista externa desaparece: usa toList.",
    ],
    starter: `import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> names = List.of("Joan", "Paula", "Kate", "Pedro");
        // resultado esperado: JOAN, KATE
    }
}`,
    solution: `import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> names = List.of("Joan", "Paula", "Kate", "Pedro");

        List<String> result = names.stream()
                .filter(name -> name.length() == 4)
                .map(String::toUpperCase)
                .toList();

        System.out.println(result);
    }
}`,
    required: [".stream(", ".filter(", ".map(", "String::toUpperCase", ".toList("],
    checklist: [
      "No uso una lista auxiliar con add dentro de for.",
      "La condicion de longitud esta en filter.",
      "La conversion esta en map.",
    ],
  },
  {
    id: "streams-reduce",
    topic: "streams",
    difficulty: "repaso",
    title: "Reduce: suma y maximo",
    prompt:
      "Con List<Integer>, calcula la suma con reduce y encuentra el mayor con max o reduce. Imprime ambos resultados.",
    attack: [
      "Para suma: reduce(0, (a, b) -> a + b) o Integer::sum.",
      "Para max: max(Integer::compareTo) devuelve Optional<Integer>.",
      "Si usas reduce para maximo, piensa en la identidad.",
    ],
    starter: `import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> nums = List.of(10, 25, 3, 5, 50, 15);
    }
}`,
    solution: `import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> nums = List.of(10, 25, 3, 5, 50, 15);

        int suma = nums.stream()
                .reduce(0, Integer::sum);

        int maximo = nums.stream()
                .max(Integer::compareTo)
                .orElseThrow();

        System.out.println(suma);
        System.out.println(maximo);
    }
}`,
    required: [".stream(", ".reduce(", "Integer::sum", ".max(", ".orElseThrow"],
    checklist: [
      "Se que reduce con identidad no devuelve Optional.",
      "Se que max devuelve Optional.",
      "No reutilizo el mismo Stream para suma y maximo.",
    ],
  },
  {
    id: "method-constructors",
    topic: "method",
    difficulty: "examen",
    title: "Constructor references",
    prompt:
      "Usa CreadorDeObjetos.crear para crear listas de Ciudad, Album y Coche desde nombres. Despues imprime cada lista con method reference.",
    attack: [
      "El metodo crear recibe una lambda que construye T desde String.",
      "Si la lambda seria name -> new Ciudad(name), usa Ciudad::new.",
      "Iterable.forEach puede recibir System.out::println.",
    ],
    starter: `import java.util.ArrayList;
import java.util.List;

interface MyLambda<A> {
    A doMyLambda(String name);
}

class CreadorDeObjetos {
    static <T> List<T> crear(MyLambda<T> lambda, List<String> names) {
        List<T> objects = new ArrayList<>();
        for (String name : names) objects.add(lambda.doMyLambda(name));
        return objects;
    }
}

record Ciudad(String name) {}
record Album(String titulo) {}
record Coche(String marca) {}

public class Main {
    public static void main(String[] args) {
        List<String> names = List.of("Valencia", "Disintegration", "Mazda");
    }
}`,
    solution: `import java.util.ArrayList;
import java.util.List;

interface MyLambda<A> {
    A doMyLambda(String name);
}

class CreadorDeObjetos {
    static <T> List<T> crear(MyLambda<T> lambda, List<String> names) {
        List<T> objects = new ArrayList<>();
        for (String name : names) objects.add(lambda.doMyLambda(name));
        return objects;
    }
}

record Ciudad(String name) {}
record Album(String titulo) {}
record Coche(String marca) {}

public class Main {
    public static void main(String[] args) {
        List<Ciudad> ciudades = CreadorDeObjetos.crear(Ciudad::new, List.of("Valencia", "Gandia"));
        List<Album> albums = CreadorDeObjetos.crear(Album::new, List.of("Disintegration", "Nevermind"));
        List<Coche> coches = CreadorDeObjetos.crear(Coche::new, List.of("Mazda", "Toyota"));

        ciudades.forEach(System.out::println);
        albums.forEach(System.out::println);
        coches.forEach(System.out::println);
    }
}`,
    required: ["Ciudad::new", "Album::new", "Coche::new", ".forEach(", "System.out::println"],
    checklist: [
      "Uso ClassName::new para constructores.",
      "No escribo lambdas si el ejercicio pide method references.",
      "El forEach recibe una accion compatible con Consumer.",
    ],
  },
  {
    id: "method-instance-first-param",
    topic: "method",
    difficulty: "examen",
    title: "Metodo del primer parametro",
    prompt:
      "Ordena estudiantes con MyFixedSizeArrayList usando referencias a metodos de instancia: por nombre, edad y matriculado.",
    attack: [
      "Comparador<T>.comparar(T a, T b) encaja con un metodo de instancia boolean compara(T b).",
      "Si la lambda seria (a, b) -> a.comparaPerEdat(b), la referencia es Estudiant::comparaPerEdat.",
      "Implementa comparaciones devolviendo true cuando a debe ir antes que b.",
    ],
    starter: `record Estudiant(String nom, Integer edat, Boolean matriculat) {
    boolean comparaPerNom(Estudiant b) {
        return false;
    }
}

interface Comparador<T> {
    boolean comparar(T a, T b);
}`,
    solution: `record Estudiant(String nom, Integer edat, Boolean matriculat) {
    boolean comparaPerNom(Estudiant b) {
        return nom.charAt(0) < b.nom.charAt(0);
    }

    boolean comparaPerEdat(Estudiant b) {
        return edat < b.edat;
    }

    boolean comparaPerMatriculat(Estudiant b) {
        return matriculat && !b.matriculat;
    }
}

interface Comparador<T> {
    boolean comparar(T a, T b);
}

class MyFixedSizeArrayList<T> {
    T[] elements;

    MyFixedSizeArrayList(T... elements) {
        this.elements = elements;
    }

    void ordenar(Comparador<T> comparador) {
        for (int i = 0; i < elements.length - 1; i++) {
            for (int j = 0; j < elements.length - 1 - i; j++) {
                if (comparador.comparar(elements[j + 1], elements[j])) {
                    T temp = elements[j];
                    elements[j] = elements[j + 1];
                    elements[j + 1] = temp;
                }
            }
        }
    }
}

public class Main {
    public static void main(String[] args) {
        var estudiants = new MyFixedSizeArrayList<>(
                new Estudiant("Annia", 43, true),
                new Estudiant("Lluis", 65, false),
                new Estudiant("Manel", 21, true)
        );

        estudiants.ordenar(Estudiant::comparaPerNom);
        estudiants.ordenar(Estudiant::comparaPerEdat);
        estudiants.ordenar(Estudiant::comparaPerMatriculat);
    }
}`,
    required: ["Estudiant::comparaPerNom", "Estudiant::comparaPerEdat", "Estudiant::comparaPerMatriculat"],
    checklist: [
      "Reconozco el patron (a, b) -> a.metodo(b).",
      "La referencia es Clase::metodo, aunque el metodo no sea static.",
      "La firma del metodo encaja con la interfaz funcional.",
    ],
  },
  {
    id: "method-object",
    topic: "method",
    difficulty: "base",
    title: "Metodo de un objeto concreto",
    prompt:
      "Dada una MyStringList y dos Impresora, imprime la lista en azul y en amarillo usando referencias a metodos de objetos.",
    attack: [
      "perCada necesita Accio: void ferAccio(String a).",
      "impresoraBlau.imprimir(String) encaja exactamente.",
      "Referencia: impresoraBlau::imprimir.",
    ],
    starter: `record Impresora(String color) {
    void imprimir(String a) {
        System.out.println(color + a);
    }
}

interface Accio {
    void ferAccio(String a);
}`,
    solution: `record Impresora(String color) {
    void imprimir(String a) {
        System.out.println(color + a);
    }
}

interface Accio {
    void ferAccio(String a);
}

class MyStringList {
    String[] elements;

    MyStringList(String... elements) {
        this.elements = elements;
    }

    void perCada(Accio accio) {
        for (String element : elements) accio.ferAccio(element);
    }
}

public class Main {
    public static void main(String[] args) {
        MyStringList list = new MyStringList("Hola", "Adeu", "Que tal");
        Impresora blau = new Impresora("\\033[34m");
        Impresora groc = new Impresora("\\033[33m");

        list.perCada(blau::imprimir);
        list.perCada(groc::imprimir);
    }
}`,
    required: ["blau::imprimir", "groc::imprimir"],
    checklist: [
      "Uso objeto::metodo porque el objeto ya existe.",
      "No uso Impresora::imprimir aqui: falta el objeto concreto.",
    ],
  },
  {
    id: "method-static",
    topic: "method",
    difficulty: "repaso",
    title: "Lambdas a referencias",
    prompt:
      "Convierte estas lambdas: s -> System.out.println(s), n -> Math.abs(n), (a,b) -> Integer.compare(a,b), name -> new Usuario(name).",
    attack: [
      "System.out es objeto concreto.",
      "Math.abs es static.",
      "Integer.compare es static con dos parametros en el mismo orden.",
      "new Usuario(name) es constructor.",
    ],
    starter: `record Usuario(String name) {}

public class Main {
    public static void main(String[] args) {
        // escribe las 4 referencias
    }
}`,
    solution: `import java.util.Comparator;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.IntUnaryOperator;

record Usuario(String name) {}

public class Main {
    public static void main(String[] args) {
        Consumer<String> printer = System.out::println;
        IntUnaryOperator absolute = Math::abs;
        Comparator<Integer> comparator = Integer::compare;
        Function<String, Usuario> creator = Usuario::new;

        printer.accept("ok");
        System.out.println(absolute.applyAsInt(-7));
        System.out.println(comparator.compare(1, 2));
        System.out.println(creator.apply("Pau"));
    }
}`,
    required: ["System.out::println", "Math::abs", "Integer::compare", "Usuario::new"],
    checklist: [
      "Identifico si el metodo es static o de objeto.",
      "Compruebo que los parametros no cambian de orden.",
      "Uso la interfaz funcional adecuada.",
    ],
  },
  {
    id: "atomic-profile",
    topic: "atomic",
    difficulty: "examen",
    title: "AtomicReference<UserProfile>",
    prompt:
      "Crea UserProfileUpdater con AtomicReference<UserProfile>. Implementa update por set, por getAndUpdate segun expectedName y por compareAndSet.",
    attack: [
      "Haz UserProfile inmutable con record.",
      "AtomicReference guarda el perfil actual.",
      "set sustituye sin condicion.",
      "getAndUpdate recibe current y devuelve current o nuevo objeto.",
      "compareAndSet exige expected exacto.",
    ],
    starter: `import java.util.concurrent.atomic.AtomicReference;

record UserProfile(String name, int age) {}

class UserProfileUpdater {
    private final AtomicReference<UserProfile> profile =
            new AtomicReference<>(new UserProfile("Juan Doe", 25));
}`,
    solution: `import java.util.concurrent.atomic.AtomicReference;

record UserProfile(String name, int age) {}

class UserProfileUpdater {
    private final AtomicReference<UserProfile> profile =
            new AtomicReference<>(new UserProfile("Juan Doe", 25));

    UserProfile getProfile() {
        return profile.get();
    }

    void updateProfile(String newName, int newAge) {
        profile.set(new UserProfile(newName, newAge));
    }

    void updateProfile(String expectedName, String newName, int newAge) {
        profile.getAndUpdate(current -> {
            if (current.name().equals(expectedName)) {
                return new UserProfile(newName, newAge);
            }
            return current;
        });
    }

    boolean updateProfile(UserProfile expected, UserProfile newProfile) {
        return profile.compareAndSet(expected, newProfile);
    }
}

public class Main {
    public static void main(String[] args) {
        UserProfileUpdater updater = new UserProfileUpdater();
        updater.updateProfile("Juan Doe", "Pau", 20);
        UserProfile expected = updater.getProfile();
        updater.updateProfile(expected, new UserProfile("Pau Silvestre", 21));
        System.out.println(updater.getProfile());
    }
}`,
    required: ["AtomicReference", "new AtomicReference", ".set(", ".getAndUpdate(", "compareAndSet"],
    checklist: [
      "No modifico campos internos de UserProfile: creo otro objeto.",
      "getAndUpdate devuelve el valor que debe quedar.",
      "compareAndSet devuelve boolean y puede fallar.",
    ],
  },
  {
    id: "atomic-task",
    topic: "atomic",
    difficulty: "examen",
    title: "TaskState con compareAndSet",
    prompt:
      "Implementa una Task abstracta con estados INIT, PROCESSING, COMPLETED. Solo un hilo puede ejecutar perform().",
    attack: [
      "El estado vive en AtomicReference<TaskState>.",
      "run intenta INIT -> PROCESSING con compareAndSet.",
      "Si gana, ejecuta perform y despues PROCESSING -> COMPLETED.",
      "Si no gana, no ejecuta perform.",
    ],
    starter: `import java.util.concurrent.atomic.AtomicReference;

enum TaskState { INIT, PROCESSING, COMPLETED }

abstract class Task implements Runnable {
    private final AtomicReference<TaskState> state =
            new AtomicReference<>(TaskState.INIT);
}`,
    solution: `import java.util.concurrent.atomic.AtomicReference;

enum TaskState {
    INIT, PROCESSING, COMPLETED
}

abstract class Task implements Runnable {
    private final AtomicReference<TaskState> state =
            new AtomicReference<>(TaskState.INIT);

    TaskState getState() {
        return state.get();
    }

    boolean setState(TaskState newState) {
        TaskState current = state.get();
        if (current == TaskState.INIT && newState == TaskState.PROCESSING) {
            return state.compareAndSet(TaskState.INIT, TaskState.PROCESSING);
        }
        if (current == TaskState.PROCESSING && newState == TaskState.COMPLETED) {
            return state.compareAndSet(TaskState.PROCESSING, TaskState.COMPLETED);
        }
        return false;
    }

    @Override
    public void run() {
        if (state.compareAndSet(TaskState.INIT, TaskState.PROCESSING)) {
            perform();
            state.compareAndSet(TaskState.PROCESSING, TaskState.COMPLETED);
        }
    }

    protected abstract void perform();
}

public class Main {
    public static void main(String[] args) throws Exception {
        Task task = new Task() {
            @Override
            protected void perform() {
                System.out.println("running once");
            }
        };

        Thread t1 = new Thread(task);
        Thread t2 = new Thread(task);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(task.getState());
    }
}`,
    required: ["AtomicReference", "TaskState", "compareAndSet", "perform", "implements Runnable"],
    checklist: [
      "perform solo se ejecuta si compareAndSet gana.",
      "El estado COMPLETED se asigna al final.",
      "Las transiciones invalidas devuelven false.",
    ],
  },
  {
    id: "atomic-access",
    topic: "atomic",
    difficulty: "repaso",
    title: "Control de acceso con AtomicInteger",
    prompt:
      "Crea AccessControl con limite maximo. connect incrementa solo si no se supera el limite; disconnect no baja de cero.",
    attack: [
      "Con AtomicInteger, leer y luego escribir por separado puede fallar.",
      "Usa compareAndSet dentro de un bucle.",
      "disconnect tambien debe proteger el minimo cero.",
    ],
    starter: `import java.util.concurrent.atomic.AtomicInteger;

class AccessControl {
    private final AtomicInteger connected = new AtomicInteger(0);
    private final int max;

    AccessControl(int max) {
        this.max = max;
    }
}`,
    solution: `import java.util.concurrent.atomic.AtomicInteger;

class AccessControl {
    private final AtomicInteger connected = new AtomicInteger(0);
    private final int max;

    AccessControl(int max) {
        this.max = max;
    }

    boolean connect() {
        while (true) {
            int current = connected.get();
            if (current >= max) return false;
            if (connected.compareAndSet(current, current + 1)) return true;
        }
    }

    boolean disconnect() {
        while (true) {
            int current = connected.get();
            if (current <= 0) return false;
            if (connected.compareAndSet(current, current - 1)) return true;
        }
    }

    int getConnected() {
        return connected.get();
    }
}`,
    required: ["AtomicInteger", ".get(", "compareAndSet", "while", "current + 1", "current - 1"],
    checklist: [
      "No hago if connected.get() < max y luego incrementAndGet sin CAS.",
      "El bucle reintenta si otro hilo cambia el valor.",
      "disconnect no deja numeros negativos.",
    ],
  },
  {
    id: "atomic-id",
    topic: "atomic",
    difficulty: "base",
    title: "IDs unicos con AtomicLong",
    prompt:
      "Implementa UniqueIDGenerator con AtomicLong desde 1. Simula 10 hilos generando 500 ids cada uno y comprueba duplicados.",
    attack: [
      "getAndIncrement devuelve el valor anterior y luego suma.",
      "ConcurrentHashMap.newKeySet sirve como Set concurrente.",
      "ExecutorService ayuda a lanzar muchas tareas.",
    ],
    starter: `import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicLong;

class UniqueIDGenerator {
}`,
    solution: `import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicLong;

class UniqueIDGenerator {
    private final AtomicLong next = new AtomicLong(1);

    long generateID() {
        return next.getAndIncrement();
    }
}

public class Main {
    public static void main(String[] args) {
        UniqueIDGenerator generator = new UniqueIDGenerator();
        Set<Long> ids = ConcurrentHashMap.newKeySet();

        try (var executor = Executors.newFixedThreadPool(10)) {
            for (int t = 0; t < 10; t++) {
                executor.submit(() -> {
                    for (int i = 0; i < 500; i++) {
                        ids.add(generator.generateID());
                    }
                });
            }
        }

        System.out.println(ids.size() == 5000);
    }
}`,
    required: ["AtomicLong", "getAndIncrement", "ConcurrentHashMap.newKeySet", "Executors.newFixedThreadPool"],
    checklist: [
      "El generador no usa long normal.",
      "La coleccion que verifica duplicados tambien es concurrente.",
      "El total esperado es 5000.",
    ],
  },
  {
    id: "concurrent-histogram",
    topic: "concurrent",
    difficulty: "examen",
    title: "Histograma con ConcurrentHashMap",
    prompt:
      "Cuenta frutas en paralelo con 4 hilos. Usa ConcurrentHashMap y una operacion atomica para actualizar el contador.",
    attack: [
      "Divide el array en rangos.",
      "Cada hilo recorre su rango.",
      "map.merge(fruta, 1, Integer::sum) evita leer y escribir por separado.",
      "Espera a que terminen los hilos antes de imprimir.",
    ],
    starter: `import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) {
        String[] palabras = {"manzana", "pera", "naranja", "uva", "manzana"};
    }
}`,
    solution: `import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) {
        String[] palabras = {
                "manzana", "pera", "naranja", "uva", "manzana",
                "naranja", "naranja", "uva", "pera", "manzana"
        };

        Map<String, Integer> histograma = new ConcurrentHashMap<>();
        int threads = 4;
        int chunk = (int) Math.ceil(palabras.length / (double) threads);

        try (var executor = Executors.newFixedThreadPool(threads)) {
            for (int t = 0; t < threads; t++) {
                int start = t * chunk;
                int end = Math.min(start + chunk, palabras.length);

                executor.submit(() -> {
                    for (int i = start; i < end; i++) {
                        histograma.merge(palabras[i], 1, Integer::sum);
                    }
                });
            }
        }

        histograma.forEach((fruta, cantidad) ->
                System.out.println(fruta + ": " + cantidad));
    }
}`,
    required: ["ConcurrentHashMap", "Executors.newFixedThreadPool", ".submit(", ".merge(", "Integer::sum"],
    checklist: [
      "No uso HashMap compartido.",
      "No hago get + put como dos operaciones separadas.",
      "Los indices start/end se copian como variables efectivamente finales.",
    ],
  },
  {
    id: "concurrent-groups",
    topic: "concurrent",
    difficulty: "examen",
    title: "Grupos de chat",
    prompt:
      "Implementa GroupsManager: addUserToGroup, removeUserFromGroup y deleteGroup usando ConcurrentHashMap y sets concurrentes.",
    attack: [
      "El mapa es ConcurrentHashMap<String, Set<String>>.",
      "computeIfAbsent crea el set si no existe.",
      "ConcurrentHashMap.newKeySet crea un Set seguro para hilos.",
      "remove puede eliminar grupo vacio despues de quitar usuario.",
    ],
    starter: `import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

class GroupsManager {
    private final ConcurrentHashMap<String, Set<String>> groups = new ConcurrentHashMap<>();
}`,
    solution: `import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

class GroupsManager {
    private final ConcurrentHashMap<String, Set<String>> groups = new ConcurrentHashMap<>();

    boolean addUserToGroup(String user, String group) {
        Set<String> users = groups.computeIfAbsent(
                group,
                ignored -> ConcurrentHashMap.newKeySet()
        );
        return users.add(user);
    }

    boolean removeUserFromGroup(String user, String group) {
        Set<String> users = groups.get(group);
        if (users == null) return false;

        boolean removed = users.remove(user);
        if (removed && users.isEmpty()) {
            groups.remove(group, users);
        }
        return removed;
    }

    boolean deleteGroup(String group) {
        return groups.remove(group) != null;
    }
}`,
    required: ["ConcurrentHashMap", "Set<String>", "computeIfAbsent", "ConcurrentHashMap.newKeySet", ".remove("],
    checklist: [
      "El set interno tambien es concurrente.",
      "computeIfAbsent evita crear grupos dos veces.",
      "remove(group, users) evita borrar si otro hilo cambio el set.",
    ],
  },
  {
    id: "concurrent-copyonwrite",
    topic: "concurrent",
    difficulty: "base",
    title: "CopyOnWriteArrayList",
    prompt:
      "Corrige una lista compartida donde dos hilos agregan mensajes y otro hilo recorre eliminando antiguos. Usa CopyOnWriteArrayList.",
    attack: [
      "CopyOnWriteArrayList permite iterar mientras otros escriben sin ConcurrentModificationException.",
      "Es buena cuando hay muchas lecturas y pocas escrituras.",
      "Para eliminar por condicion, usa removeIf.",
    ],
    starter: `import java.time.LocalDateTime;
import java.util.List;

record Mensaje(String text, LocalDateTime date) {
    Mensaje(String text) {
        this(text, LocalDateTime.now());
    }
}`,
    solution: `import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

record Mensaje(String text, LocalDateTime date) {
    Mensaje(String text) {
        this(text, LocalDateTime.now());
    }
}

public class Main {
    public static void main(String[] args) throws Exception {
        List<Mensaje> mensajes = new CopyOnWriteArrayList<>();

        Runnable user = () -> {
            for (int i = 0; i < 5; i++) {
                mensajes.add(new Mensaje(Thread.currentThread().getName() + "-" + i));
                System.out.println("mensajes: " + mensajes.size());
                try {
                    Thread.sleep(300);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        Thread cleaner = new Thread(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                mensajes.removeIf(m ->
                        ChronoUnit.SECONDS.between(m.date(), LocalDateTime.now()) > 3);
            }
        });

        cleaner.start();
        Thread t1 = new Thread(user, "u1");
        Thread t2 = new Thread(user, "u2");
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        cleaner.interrupt();
    }
}`,
    required: ["CopyOnWriteArrayList", ".add(", ".removeIf(", "Thread"],
    checklist: [
      "Se por que no uso ArrayList compartida.",
      "No modifico la lista dentro de un for-each normal sobre ArrayList.",
      "Entiendo el coste: copiar al escribir.",
    ],
  },
  {
    id: "concurrent-reservas",
    topic: "concurrent",
    difficulty: "repaso",
    title: "Reservas de hotel",
    prompt:
      "Garantiza que dos reservas de la misma habitacion no se solapen. Usa ConcurrentHashMap y una lista por habitacion.",
    attack: [
      "La clave del mapa es la habitacion.",
      "compute permite bloquear atomicamente la actualizacion de esa habitacion.",
      "Comprueba solape: inicio < otraFin && fin > otraInicio.",
      "Devuelve true/false. Puedes usar AtomicBoolean para sacar el resultado del compute.",
    ],
    starter: `import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

record Reserva(String usuario, int inicio, int fin) {}

class Hotel {
}`,
    solution: `import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

record Reserva(String usuario, int inicio, int fin) {
    boolean solapa(Reserva other) {
        return inicio < other.fin && fin > other.inicio;
    }
}

class Hotel {
    private final ConcurrentHashMap<Integer, List<Reserva>> reservas = new ConcurrentHashMap<>();

    boolean reservar(int habitacion, String usuario, int inicio, int fin) {
        AtomicBoolean aceptada = new AtomicBoolean(false);
        Reserva nueva = new Reserva(usuario, inicio, fin);

        reservas.compute(habitacion, (room, actuales) -> {
            List<Reserva> lista = actuales == null ? new ArrayList<>() : new ArrayList<>(actuales);
            boolean ocupada = lista.stream().anyMatch(nueva::solapa);

            if (!ocupada) {
                lista.add(nueva);
                aceptada.set(true);
            }

            return lista;
        });

        return aceptada.get();
    }
}`,
    required: ["ConcurrentHashMap", ".compute(", "AtomicBoolean", ".stream(", ".anyMatch(", ".add("],
    checklist: [
      "La comprobacion y el add ocurren en el mismo compute.",
      "Uso la formula correcta de solape.",
      "No devuelvo true antes de comprobar conflictos.",
    ],
  },
  {
    id: "socket-hello",
    topic: "socket",
    difficulty: "base",
    title: "Servidor Hola mundo",
    prompt:
      "Crea un servidor que escuche en 8080, acepte conexiones repetidamente, envie Hola, mundo y cierre cada socket.",
    attack: [
      "try-with-resources para ServerSocket.",
      "while (true) para aceptar muchas conexiones.",
      "serverSocket.accept() bloquea.",
      "PrintWriter con autoFlush true.",
    ],
    starter: `import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class Main {
    public static void main(String[] args) throws Exception {
    }
}`,
    solution: `import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class Main {
    public static void main(String[] args) throws Exception {
        try (ServerSocket serverSocket = new ServerSocket(8080)) {
            while (true) {
                try (Socket socket = serverSocket.accept();
                     PrintWriter writer = new PrintWriter(socket.getOutputStream(), true)) {
                    writer.println("Hola, mundo");
                }
            }
        }
    }
}`,
    required: ["new ServerSocket", "while", ".accept(", "new PrintWriter", "getOutputStream", ".println("],
    checklist: [
      "El accept esta dentro del while.",
      "El PrintWriter tiene autoFlush true.",
      "Cierro socket y writer con try-with-resources.",
    ],
  },
  {
    id: "socket-virtual",
    topic: "socket",
    difficulty: "examen",
    title: "Servidor con hilos virtuales",
    prompt:
      "Mejora el servidor: cada cliente se atiende en un hilo virtual para que el segundo cliente no espere al primero.",
    attack: [
      "Crea un executor con Executors.newVirtualThreadPerTaskExecutor().",
      "El bucle principal solo acepta y envia la tarea.",
      "El socket se cierra dentro de la tarea.",
      "Mete sleep dentro de la tarea si quieres probar concurrencia.",
    ],
    starter: `import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) throws Exception {
    }
}`,
    solution: `import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) throws Exception {
        try (ServerSocket serverSocket = new ServerSocket(8080);
             var executor = Executors.newVirtualThreadPerTaskExecutor()) {

            while (true) {
                Socket socket = serverSocket.accept();
                executor.submit(() -> handle(socket));
            }
        }
    }

    private static void handle(Socket socket) {
        try (socket;
             PrintWriter writer = new PrintWriter(socket.getOutputStream(), true)) {
            Thread.sleep(5000);
            writer.println("Hola, mundo");
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }
}`,
    required: ["Executors.newVirtualThreadPerTaskExecutor", ".accept(", ".submit(", "handle", "new PrintWriter"],
    checklist: [
      "El while no duerme: duerme la tarea del cliente.",
      "No cierro el socket antes de pasarlo a handle.",
      "La tarea captura el socket aceptado en esa iteracion.",
    ],
  },
  {
    id: "socket-echo",
    topic: "socket",
    difficulty: "repaso",
    title: "Servidor echo con mensaje especial",
    prompt:
      "Servidor y cliente por consola. El servidor responde a cada linea. Si recibe /hora, contesta con la hora actual.",
    attack: [
      "Servidor: BufferedReader para leer y PrintWriter para escribir.",
      "reader.lines() te permite procesar Stream<String>, pero readLine en while es mas controlable.",
      "Cliente: Socket localhost:8080, leer teclado, enviar, leer respuesta.",
    ],
    starter: `// Escribe servidor o cliente. Prioridad: estructura de reader/writer.`,
    solution: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.time.LocalTime;

public class EchoServer {
    public static void main(String[] args) throws Exception {
        try (ServerSocket serverSocket = new ServerSocket(8080)) {
            while (true) {
                try (Socket socket = serverSocket.accept();
                     BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                     PrintWriter writer = new PrintWriter(socket.getOutputStream(), true)) {

                    String line;
                    while ((line = reader.readLine()) != null) {
                        if (line.equals("/hora")) {
                            writer.println(LocalTime.now());
                        } else {
                            writer.println("echo: " + line);
                        }
                    }
                }
            }
        }
    }
}`,
    required: ["BufferedReader", "InputStreamReader", "getInputStream", "PrintWriter", "getOutputStream", "readLine"],
    checklist: [
      "Tengo reader y writer sobre el mismo socket.",
      "El bucle lee hasta null.",
      "El mensaje especial se comprueba antes del echo normal.",
    ],
  },
  {
    id: "socket-client",
    topic: "socket",
    difficulty: "base",
    title: "Cliente TCP minimo",
    prompt:
      "Crea un cliente que conecte a localhost:8080, envie una linea, lea una respuesta y la imprima.",
    attack: [
      "Socket(host, port) inicia la conexion.",
      "PrintWriter envia al servidor.",
      "BufferedReader recibe respuesta.",
      "Usa autoFlush true o puede no enviarse la linea.",
    ],
    starter: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class Client {
    public static void main(String[] args) throws Exception {
    }
}`,
    solution: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class Client {
    public static void main(String[] args) throws Exception {
        try (Socket socket = new Socket("localhost", 8080);
             PrintWriter writer = new PrintWriter(socket.getOutputStream(), true);
             BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {

            writer.println("hola servidor");
            String response = reader.readLine();
            System.out.println(response);
        }
    }
}`,
    required: ["new Socket", "localhost", "new PrintWriter", "BufferedReader", "readLine", ".println("],
    checklist: [
      "El cliente usa Socket, no ServerSocket.",
      "Envio y leo por el mismo socket.",
      "Cierro recursos con try-with-resources.",
    ],
  },
];


const theorySections = [
  {
    title: "Idea basica de un Stream",
    kicker: "Mentalidad",
    body:
      "Un Stream no es una lista nueva: es una forma de recorrer datos declarando pasos. Piensa siempre en fuente, operaciones intermedias y operacion terminal.",
    bullets: [
      "Fuente: de donde salen los datos: lista.stream(), Stream.of(...), Files.lines(...), Arrays.stream(...).",
      "Intermedias: transforman o filtran y devuelven otro Stream: filter, map, sorted, distinct, limit, flatMap.",
      "Terminales: disparan la ejecucion y producen resultado o efecto: toList, collect, forEach, count, reduce, anyMatch.",
      "Si no escribes una terminal, el pipeline no se ejecuta. Si ya usaste una terminal, ese Stream queda consumido.",
    ],
    code: `List<String> result = names.stream()       // fuente
    .filter(name -> name.length() == 4)  // intermedia
    .map(String::toUpperCase)            // intermedia
    .toList();                           // terminal`,
  },
  {
    title: "Tipos de stream que mas salen",
    kicker: "Fuentes",
    body:
      "Para el examen necesitas reconocer de que tipo parte el pipeline y que operaciones encajan mejor con cada fuente.",
    bullets: [
      "Stream<T>: objetos normales, por ejemplo Stream<String>, Stream<Movie> o Stream<User>.",
      "IntStream, LongStream y DoubleStream: streams primitivos para numeros; traen sum, average, max y evitan boxing.",
      "Files.lines(Path): lee un fichero como Stream<String>; cada linea es un elemento y conviene usar try-with-resources si no terminalizas enseguida.",
      "Stream.of(...) y Arrays.stream(...): fuentes rapidas para datos de prueba o arrays.",
      "parallelStream(): reparte trabajo entre hilos, pero no lo uses por defecto; exige operaciones sin estado compartido inseguro.",
    ],
    code: `Stream<String> words = Stream.of("java", "psp");
IntStream numbers = IntStream.rangeClosed(1, 5);
Stream<String> lines = Files.lines(Path.of("entrada.txt"));`,
  },
  {
    title: "Como leer un pipeline sin perderte",
    kicker: "Lectura",
    body:
      "Lee de izquierda a derecha como una cadena de montaje. En cada paso preguntate que entra, que sale y si sigue siendo Stream o ya es resultado final.",
    bullets: [
      "filter: entra un elemento y decide true/false; no cambia el tipo.",
      "map: entra un elemento y sale otro valor; puede cambiar el tipo, por ejemplo Movie -> String.",
      "sorted: ordena los elementos que siguen vivos; normalmente necesita Comparator.comparing(...).",
      "distinct: elimina repetidos usando equals/hashCode.",
      "flatMap: cuando cada elemento produce varios elementos y necesitas aplanarlos.",
      "reduce: combina muchos valores en uno, como suma, maximo o concatenacion.",
    ],
    code: `movies.stream()
    .filter(movie -> movie.rating() >= 8.8)  // Stream<Movie>
    .sorted(Comparator.comparing(Movie::duration))
    .map(Movie::title)                       // Stream<String>
    .forEach(System.out::println);           // void`,
  },
  {
    title: "Chuleta de terminales",
    kicker: "Resultado",
    body:
      "La terminal marca que quieres obtener al final. Antes de escribir codigo, decide si necesitas lista, numero, booleano, Optional o imprimir.",
    bullets: [
      "toList o collect: cuando quieres guardar el resultado transformado.",
      "forEach: cuando solo quieres hacer una accion, como imprimir o enviar mensajes.",
      "count, sum, average: cuando quieres resumen numerico.",
      "anyMatch, allMatch, noneMatch: cuando quieres una pregunta de si/no.",
      "findFirst o max/min: devuelven Optional porque puede no existir resultado.",
      "reduce: util cuando no hay terminal especializada o necesitas una acumulacion propia.",
    ],
    code: `long approved = students.stream()
    .filter(student -> student.grade() >= 5)
    .count();

boolean hasAdmin = users.stream()
    .anyMatch(user -> user.role().equals("ADMIN"));`,
  },
  {
    title: "Errores de principiante con Streams",
    kicker: "Evitar puntos tontos",
    body:
      "Casi todos los fallos vienen de olvidar que el Stream es de un solo uso y que las lambdas deben ser simples y sin estado compartido raro.",
    bullets: [
      "No reutilices el mismo Stream tras toList, count, forEach o cualquier terminal.",
      "No metas add sobre una lista externa si puedes terminar con toList o collect.",
      "No confundas map con filter: map transforma, filter decide si se queda.",
      "No uses parallelStream si dentro actualizas ArrayList, HashMap o variables normales compartidas.",
      "Cuando leas ficheros, recuerda importar java.nio.file.Files y Path.",
    ],
    code: `// Mal: el stream ya esta consumido tras count()
Stream<String> stream = names.stream();
long total = stream.count();
List<String> upper = stream.map(String::toUpperCase).toList();`,
  },
];

const patternCards = [
  {
    id: "p-stream-fit",
    topic: "streams",
    front: "Estructura mental de cualquier Stream",
    prompt: "Di los tres bloques antes de escribir codigo.",
    answer: "Fuente -> operaciones intermedias -> operacion terminal.",
    code: `lista.stream()
    .filter(...)
    .map(...)
    .sorted(...)
    .toList();`,
  },
  {
    id: "p-stream-files",
    topic: "streams",
    front: "Leer fichero como Stream",
    prompt: "Plantilla para entrada.txt -> salida.txt.",
    answer: "Files.lines devuelve Stream<String>; Files.write recibe Iterable de lineas.",
    code: `List<String> lines = Files.lines(Path.of("entrada.txt"))
    .distinct()
    .map(String::toUpperCase)
    .toList();

Files.write(Path.of("salida.txt"), lines);`,
  },
  {
    id: "p-method-static",
    topic: "method",
    front: "Lambda a metodo static",
    prompt: "Transforma x -> Clase.metodo(x).",
    answer: "Clase::metodo si los parametros van en el mismo orden.",
    code: `Function<String, Integer> f = Integer::parseInt;
Comparator<Integer> c = Integer::compare;`,
  },
  {
    id: "p-method-object",
    topic: "method",
    front: "Metodo de objeto existente",
    prompt: "Transforma x -> objeto.metodo(x).",
    answer: "objeto::metodo.",
    code: `PrintWriter writer = new PrintWriter(..., true);
Consumer<String> send = writer::println;`,
  },
  {
    id: "p-method-first",
    topic: "method",
    front: "Metodo del primer parametro",
    prompt: "Transforma (a, b) -> a.metodo(b).",
    answer: "Clase::metodo, aunque el metodo sea de instancia.",
    code: `Comparator<String> c = String::compareToIgnoreCase;
BiPredicate<Estudiant, Estudiant> p = Estudiant::comparaPerEdat;`,
  },
  {
    id: "p-method-new",
    topic: "method",
    front: "Constructor reference",
    prompt: "Transforma x -> new Clase(x).",
    answer: "Clase::new.",
    code: `Function<String, Usuario> creator = Usuario::new;`,
  },
  {
    id: "p-atomic-ref",
    topic: "atomic",
    front: "Actualizar objeto compartido",
    prompt: "Plantilla AtomicReference con objeto inmutable.",
    answer: "No cambies campos internos. Crea un record nuevo y sustituyelo atomically.",
    code: `AtomicReference<UserProfile> ref = new AtomicReference<>(initial);

ref.getAndUpdate(current ->
    current.name().equals(expected) ? new UserProfile(newName, newAge) : current
);`,
  },
  {
    id: "p-atomic-cas",
    topic: "atomic",
    front: "Transicion de estado segura",
    prompt: "Solo pasar INIT -> PROCESSING si nadie se adelanto.",
    answer: "compareAndSet(esperado, nuevo).",
    code: `if (state.compareAndSet(TaskState.INIT, TaskState.PROCESSING)) {
    perform();
    state.compareAndSet(TaskState.PROCESSING, TaskState.COMPLETED);
}`,
  },
  {
    id: "p-concurrent-merge",
    topic: "concurrent",
    front: "Contador en ConcurrentHashMap",
    prompt: "Incrementar frecuencia sin get + put.",
    answer: "merge(clave, valorInicial, funcionDeUnion).",
    code: `counts.merge(word, 1, Integer::sum);`,
  },
  {
    id: "p-concurrent-compute",
    topic: "concurrent",
    front: "Crear y actualizar por clave",
    prompt: "Grupo que se crea si no existe.",
    answer: "computeIfAbsent + coleccion concurrente.",
    code: `Set<String> users = groups.computeIfAbsent(
    group,
    ignored -> ConcurrentHashMap.newKeySet()
);
users.add(user);`,
  },
  {
    id: "p-socket-server",
    topic: "socket",
    front: "Servidor TCP minimo",
    prompt: "Esqueleto de memoria.",
    answer: "ServerSocket abre puerto; accept devuelve Socket.",
    code: `try (ServerSocket server = new ServerSocket(8080)) {
    while (true) {
        try (Socket socket = server.accept();
             PrintWriter writer = new PrintWriter(socket.getOutputStream(), true)) {
            writer.println("Hola");
        }
    }
}`,
  },
  {
    id: "p-socket-client",
    topic: "socket",
    front: "Cliente TCP minimo",
    prompt: "Conectar, enviar y leer.",
    answer: "Socket(host, port) + reader/writer.",
    code: `try (Socket socket = new Socket("localhost", 8080);
     PrintWriter writer = new PrintWriter(socket.getOutputStream(), true);
     BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {
    writer.println("hola");
    System.out.println(reader.readLine());
}`,
  },
];

const mistakes = [
  {
    topic: "Streams",
    title: "Errores que suspenden facil",
    items: [
      "Guardar un Stream y querer usarlo dos veces despues de una terminal.",
      "Olvidar la terminal: filter/map solos no ejecutan nada.",
      "Usar map cuando necesitas aplanar listas: ahi suele ser flatMap.",
      "Llamar get() a Optional sin comprobar o sin orElseThrow.",
      "Ordenar strings numericos como texto cuando hay que convertir a numero.",
    ],
  },
  {
    topic: "Method Reference",
    title: "La regla del mismo orden",
    items: [
      "Usar method reference cuando la lambda cambia el orden de parametros.",
      "Confundir objeto::metodo con Clase::metodo.",
      "Olvidar que Clase::metodo puede referirse al metodo del primer parametro.",
      "Usar Clase::new sin que la interfaz funcional devuelva una instancia.",
    ],
  },
  {
    topic: "Atomic",
    title: "Atomico no significa magico",
    items: [
      "Hacer get y luego set pensando que el conjunto es atomico.",
      "Modificar un objeto mutable dentro de AtomicReference.",
      "No contemplar que compareAndSet puede devolver false.",
      "Usar incrementAndGet cuando necesitas comprobar limite antes de incrementar.",
    ],
  },
  {
    topic: "Concurrent Collections",
    title: "Coleccion segura, operacion insegura",
    items: [
      "Usar ConcurrentHashMap pero hacer get + put como secuencia separada.",
      "Meter ArrayList normal como valor compartido dentro de ConcurrentHashMap.",
      "Usar CopyOnWriteArrayList para muchisimas escrituras sin entender el coste.",
      "Eliminar mientras iteras una ArrayList compartida.",
    ],
  },
  {
    topic: "ServerSockets",
    title: "Bloqueos y recursos",
    items: [
      "Confundir ServerSocket con Socket en el cliente.",
      "Olvidar que accept() bloquea hasta que llegue un cliente.",
      "Crear PrintWriter sin autoFlush y no enviar la respuesta.",
      "Atender al cliente dentro del hilo principal cuando el ejercicio pide multithreading.",
      "Cerrar el socket antes de que la tarea del hilo lo use.",
    ],
  },
];

const views = ["dashboard", "practice", "theory", "patterns", "exam", "mistakes"];

const state = {
  view: "dashboard",
  topic: "all",
  patternTopic: "all",
  answers: load("answers", {}),
  examAnswers: load("examAnswers", {}),
  mastered: load("mastered", {}),
  plan: load("plan", {}),
  cardStatus: load("cardStatus", {}),
  examIds: load("examIds", []),
  examEnd: load("examEnd", null),
  examDuration: load("examDuration", 90 * 60),
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(STORE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(STORE_PREFIX + key, JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatRequirement(req) {
  return Array.isArray(req) ? req.join(" o ") : req;
}

function normalize(value) {
  return String(value).toLowerCase().replace(/\s+/g, " ").trim();
}

function requirementMatches(req, text) {
  const haystack = normalize(text);
  if (Array.isArray(req)) return req.some((item) => requirementMatches(item, text));
  return haystack.includes(normalize(req));
}

function missingRequirements(exercise, answer) {
  return exercise.required.filter((req) => !requirementMatches(req, answer));
}

function topicById(id) {
  return topics.find((topic) => topic.id === id);
}

function exerciseById(id) {
  return exercises.find((exercise) => exercise.id === id);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function renderTopicChips() {
  $("#topic-chips").innerHTML = topics
    .map(
      (topic) => `
        <span class="chip" data-tone="${topic.tone}">
          ${escapeHtml(topic.label)}
        </span>
      `
    )
    .join("");
}

function getValidView(view) {
  return views.includes(view) ? view : "dashboard";
}

function getClosestElement(target, selector) {
  const element = target instanceof Element ? target : target?.parentElement;
  return element?.closest(selector) || null;
}

function setView(view) {
  view = getValidView(view);
  state.view = view;
  $$("[data-view-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.viewPanel !== view;
  });
  $$("[data-view-link]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewLink === view);
  });
  if (location.hash !== `#${view}`) {
    history.pushState(null, "", `#${view}`);
  }
  renderView(view);
}

function renderView(view) {
  if (view === "dashboard") renderDashboard();
  if (view === "practice") renderPractice();
  if (view === "theory") renderTheory();
  if (view === "patterns") renderPatterns();
  if (view === "exam") renderExam();
  if (view === "mistakes") renderMistakes();
}

function renderDashboard() {
  const panel = $("#dashboard-panel");
  const total = exercises.length;
  const masteredCount = Object.values(state.mastered).filter(Boolean).length;
  const planDone = studyPlan.filter((item) => state.plan[item.id]).length;
  const weak = exercises.filter((exercise) => !state.mastered[exercise.id]).slice(0, 4);

  panel.innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Panel de control</p>
        <h2>Lo importante es producir codigo compilable</h2>
        <p>Trabaja en ciclos: intentar sin mirar, abrir pista, corregir estructura, repetir al dia siguiente.</p>
      </div>
      <button class="ghost-button" type="button" data-action="clear-progress">Reiniciar progreso</button>
    </div>

    <div class="stats-grid">
      <article class="stat-card">
        <h3>Dominados</h3>
        <span class="stat-value">${masteredCount}/${total}</span>
        <p>Marca un ejercicio solo si podrias rehacerlo mañana sin copiar.</p>
      </article>
      <article class="stat-card">
        <h3>Plan</h3>
        <span class="stat-value">${planDone}/${studyPlan.length}</span>
        <p>Bloques pensados para llegar al viernes con practica fresca.</p>
      </article>
      <article class="stat-card">
        <h3>Simulacro</h3>
        <span class="stat-value">${state.examIds.length || 0}</span>
        <p>Genera uno cuando ya hayas calentado con ejercicios sueltos.</p>
      </article>
    </div>

    <article class="plan-block">
      <div class="section-header">
        <div>
          <p class="eyebrow">Progreso por tema</p>
          <h3>Recuperacion de Pau</h3>
        </div>
      </div>
      <div class="progress-list">
        ${topics.map(renderTopicProgress).join("")}
      </div>
    </article>

    <article class="plan-block">
      <div class="section-header">
        <div>
          <p class="eyebrow">Siguiente accion</p>
          <h3>Ejercicios que aun no estan verdes</h3>
        </div>
        <button class="primary-button" type="button" data-action="go-practice">Abrir ejercicios</button>
      </div>
      <div class="quick-grid">
        ${
          weak.length
            ? weak.map(renderQuickExercise).join("")
            : `<div class="empty-state">Todo marcado. Toca simulacro sin ayudas.</div>`
        }
      </div>
    </article>

    <article class="plan-block">
      <div class="section-header">
        <div>
          <p class="eyebrow">Ruta hasta el examen</p>
          <h3>19 de junio a las 10:00</h3>
        </div>
      </div>
      <ul class="plan-list">
        ${studyPlan
          .map(
            (item) => `
              <li>
                <label>
                  <input type="checkbox" data-plan-id="${item.id}" ${state.plan[item.id] ? "checked" : ""}>
                  <span>
                    <strong>${escapeHtml(item.slot)} · ${escapeHtml(item.title)}</strong>
                    ${escapeHtml(item.detail)}
                  </span>
                </label>
              </li>
            `
          )
          .join("")}
      </ul>
    </article>
  `;
}

function renderTopicProgress(topic) {
  const topicExercises = exercises.filter((exercise) => exercise.topic === topic.id);
  const done = topicExercises.filter((exercise) => state.mastered[exercise.id]).length;
  const percent = topicExercises.length ? Math.round((done / topicExercises.length) * 100) : 0;

  return `
    <div class="progress-item">
      <strong>${escapeHtml(topic.label)}</strong>
      <div class="bar" aria-label="${escapeHtml(topic.label)} ${percent}%">
        <span style="width: ${percent}%"></span>
      </div>
      <span>${percent}%</span>
    </div>
  `;
}

function renderQuickExercise(exercise) {
  const topic = topicById(exercise.topic);
  return `
    <article class="template-card">
      <div class="template-title-row">
        <span class="chip" data-tone="${topic.tone}">${escapeHtml(topic.label)}</span>
        <span class="difficulty" data-level="${exercise.difficulty}">${escapeHtml(exercise.difficulty)}</span>
      </div>
      <h3>${escapeHtml(exercise.title)}</h3>
      <p>${escapeHtml(exercise.prompt)}</p>
      <button class="small-button" type="button" data-action="open-exercise" data-id="${exercise.id}">
        Practicar
      </button>
    </article>
  `;
}

function renderPractice() {
  const panel = $("#practice-panel");
  const filtered = state.topic === "all" ? exercises : exercises.filter((exercise) => exercise.topic === state.topic);

  panel.innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Practica activa</p>
        <h2>Escribe primero. Mira despues.</h2>
        <p>La comprobacion revisa estructura, no compila. Si la estructura sale bien, copialo a Java y remata errores de sintaxis.</p>
      </div>
    </div>
    <div class="filter-bar">
      ${renderTopicFilter("all", "Todos", state.topic)}
      ${topics.map((topic) => renderTopicFilter(topic.id, topic.label, state.topic)).join("")}
    </div>
    <div class="exercise-list">
      ${filtered.map(renderExerciseCard).join("")}
    </div>
  `;
}

function renderTopicFilter(id, label, active) {
  return `
    <button
      class="filter-button ${active === id ? "is-active" : ""}"
      type="button"
      data-action="filter-topic"
      data-topic="${id}"
    >
      ${escapeHtml(label)}
    </button>
  `;
}

function renderExerciseCard(exercise) {
  const topic = topicById(exercise.topic);
  const answer = state.answers[exercise.id] || "";
  const mastered = Boolean(state.mastered[exercise.id]);

  return `
    <article class="exercise-card" id="exercise-${exercise.id}">
      <div class="exercise-main">
        <div class="exercise-title-row">
          <div>
            <span class="chip" data-tone="${topic.tone}">${escapeHtml(topic.label)}</span>
            <span class="difficulty" data-level="${exercise.difficulty}">${escapeHtml(exercise.difficulty)}</span>
          </div>
          <button
            class="${mastered ? "primary-button" : "small-button"}"
            type="button"
            data-action="toggle-mastered"
            data-id="${exercise.id}"
          >
            ${mastered ? "Dominado" : "Marcar dominado"}
          </button>
        </div>

        <div>
          <h3>${escapeHtml(exercise.title)}</h3>
          <p>${escapeHtml(exercise.prompt)}</p>
        </div>

        <textarea
          class="answer-box"
          data-answer="${exercise.id}"
          spellcheck="false"
          placeholder="Escribe aqui tu solucion Java sin mirar..."
        >${escapeHtml(answer)}</textarea>

        <div class="action-row">
          <button class="primary-button" type="button" data-action="check-exercise" data-id="${exercise.id}">
            Comprobar estructura
          </button>
          <button class="small-button" type="button" data-action="load-starter" data-id="${exercise.id}">
            Poner plantilla
          </button>
          <button class="small-button" type="button" data-action="copy-solution" data-id="${exercise.id}">
            Copiar solucion
          </button>
        </div>

        <div class="result-box" data-result="${exercise.id}">
          Escribe tu intento y comprueba si aparecen las piezas clave.
        </div>
      </div>

      <aside class="exercise-aside">
        <details open>
          <summary>Plan de ataque</summary>
          <ol class="attack-list">
            ${exercise.attack.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ol>
        </details>

        <details>
          <summary>Plantilla</summary>
          <pre><code>${escapeHtml(exercise.starter)}</code></pre>
        </details>

        <details>
          <summary>Solucion razonable</summary>
          <pre><code>${escapeHtml(exercise.solution)}</code></pre>
        </details>

        <details>
          <summary>Checklist mental</summary>
          <ul class="check-list">
            ${exercise.checklist
              .map(
                (item) => `
                  <li>
                    <label>
                      <input type="checkbox">
                      <span>${escapeHtml(item)}</span>
                    </label>
                  </li>
                `
              )
              .join("")}
          </ul>
        </details>
      </aside>
    </article>
  `;
}


function renderTheory() {
  const panel = $("#theory-panel");
  panel.innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Teoria</p>
        <h2>Streams desde cero para saber por donde van los tiros</h2>
        <p>Una lectura rapida para entender tipos de stream, partes del pipeline y como razonar un ejercicio antes de tocar el teclado.</p>
      </div>
    </div>

    <div class="theory-hero">
      <article>
        <span class="chip" data-tone="green">Regla de oro</span>
        <h3>Fuente -> intermedias -> terminal</h3>
        <p>Todo ejercicio de streams se puede atacar identificando de donde salen los datos, que pasos los filtran o transforman, y que resultado final pide el enunciado.</p>
      </article>
      <article>
        <span class="chip" data-tone="blue">Pregunta clave</span>
        <h3>¿Que tipo tengo ahora?</h3>
        <p>Despues de cada operacion, comprueba mentalmente si sigues teniendo Stream&lt;T&gt;, Stream&lt;R&gt;, un numero, un booleano, una List o un Optional.</p>
      </article>
    </div>

    <div class="theory-grid">
      ${theorySections.map(renderTheoryCard).join("")}
    </div>
  `;
}

function renderTheoryCard(section) {
  return `
    <article class="theory-card">
      <span class="mini-label">${escapeHtml(section.kicker)}</span>
      <h3>${escapeHtml(section.title)}</h3>
      <p>${escapeHtml(section.body)}</p>
      <ul class="theory-list">
        ${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
      <pre><code>${escapeHtml(section.code)}</code></pre>
    </article>
  `;
}

function renderPatterns() {
  const panel = $("#patterns-panel");
  const filtered =
    state.patternTopic === "all" ? patternCards : patternCards.filter((card) => card.topic === state.patternTopic);

  panel.innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Memoria activa</p>
        <h2>Patrones que debes escribir de cabeza</h2>
        <p>Lee el frente, di la respuesta en voz alta o escribela en papel, y solo entonces abre la tarjeta.</p>
      </div>
    </div>
    <div class="filter-bar">
      ${renderPatternFilter("all", "Todos", state.patternTopic)}
      ${topics.map((topic) => renderPatternFilter(topic.id, topic.label, state.patternTopic)).join("")}
    </div>
    <div class="template-grid">
      ${filtered.map(renderPatternCard).join("")}
    </div>
  `;
}

function renderPatternFilter(id, label, active) {
  return `
    <button
      class="filter-button ${active === id ? "is-active" : ""}"
      type="button"
      data-action="filter-pattern-topic"
      data-topic="${id}"
    >
      ${escapeHtml(label)}
    </button>
  `;
}

function renderPatternCard(card) {
  const topic = topicById(card.topic);
  const status = state.cardStatus[card.id] || "nuevo";
  return `
    <article class="flashcard" data-flash-card="${card.id}">
      <div class="template-title-row">
        <span class="chip" data-tone="${topic.tone}">${escapeHtml(topic.label)}</span>
        <span class="difficulty" data-level="${status === "ok" ? "base" : "repaso"}">${escapeHtml(status)}</span>
      </div>
      <strong>${escapeHtml(card.front)}</strong>
      <p>${escapeHtml(card.prompt)}</p>
      <div class="action-row">
        <button class="small-button" type="button" data-action="toggle-flash" data-id="${card.id}">
          Ver respuesta
        </button>
        <button class="small-button" type="button" data-action="card-review" data-id="${card.id}">
          Repasar
        </button>
        <button class="primary-button" type="button" data-action="card-know" data-id="${card.id}">
          Me sale
        </button>
      </div>
      <div class="flash-answer">
        <p><strong>Respuesta:</strong> ${escapeHtml(card.answer)}</p>
        <pre><code>${escapeHtml(card.code)}</code></pre>
      </div>
    </article>
  `;
}

function renderExam() {
  const panel = $("#exam-panel");
  const examExercises = state.examIds.map(exerciseById).filter(Boolean);
  const hasExam = examExercises.length > 0;

  panel.innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Simulacro</p>
        <h2>Un examen pequeño, sin abrir soluciones</h2>
        <p>Genera una ronda y escribe soluciones completas. Despues usa comprobar estructura para detectar huecos.</p>
      </div>
      <div class="action-row">
        <button class="primary-button" type="button" data-action="generate-exam">Generar simulacro</button>
        <button class="small-button" type="button" data-action="check-exam">Comprobar todo</button>
      </div>
    </div>

    <div class="exam-layout">
      <div class="exam-list">
        ${
          hasExam
            ? examExercises.map(renderExamCard).join("")
            : `<div class="empty-state">Pulsa generar simulacro cuando quieras pelearte con el examen en serio.</div>`
        }
      </div>
      <aside class="exam-card timer-box">
        <h3>Temporizador</h3>
        <div class="timer-face" id="timer-face">90:00</div>
        <label>
          <span class="mini-label">Duracion</span>
          <select id="duration-select">
            <option value="45">45 min</option>
            <option value="60">60 min</option>
            <option value="90">90 min</option>
            <option value="120">120 min</option>
          </select>
        </label>
        <div class="action-row">
          <button class="primary-button" type="button" data-action="start-timer">Empezar</button>
          <button class="small-button" type="button" data-action="reset-timer">Reset</button>
        </div>
        <p>Regla: si te bloqueas mas de 6 minutos, escribe plantilla y sigue. Luego vuelves.</p>
      </aside>
    </div>
  `;

  const select = $("#duration-select");
  if (select) select.value = String(Math.round(state.examDuration / 60));
  updateExamTimer();
}

function renderExamCard(exercise, index) {
  const topic = topicById(exercise.topic);
  const answer = state.examAnswers[exercise.id] || "";
  return `
    <article class="exam-card">
      <div class="exam-title-row">
        <span class="chip" data-tone="${topic.tone}">${index + 1}. ${escapeHtml(topic.label)}</span>
        <span class="difficulty" data-level="${exercise.difficulty}">${escapeHtml(exercise.difficulty)}</span>
      </div>
      <h3>${escapeHtml(exercise.title)}</h3>
      <p>${escapeHtml(exercise.prompt)}</p>
      <textarea
        class="answer-box"
        data-exam-answer="${exercise.id}"
        spellcheck="false"
        placeholder="Solucion de simulacro..."
      >${escapeHtml(answer)}</textarea>
      <div class="action-row">
        <button class="small-button" type="button" data-action="check-exam-exercise" data-id="${exercise.id}">
          Comprobar estructura
        </button>
      </div>
      <div class="result-box" data-exam-result="${exercise.id}">
        Pendiente.
      </div>
    </article>
  `;
}

function renderMistakes() {
  const panel = $("#mistakes-panel");
  panel.innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Fallos tipicos</p>
        <h2>Lista de control antes de entregar</h2>
        <p>Usala al final de cada ejercicio. En un examen practico, esto salva puntos muy baratos.</p>
      </div>
    </div>
    <div class="mistake-grid">
      ${mistakes
        .map(
          (group) => `
            <article class="mistake-card">
              <span class="chip" data-tone="blue">${escapeHtml(group.topic)}</span>
              <h3>${escapeHtml(group.title)}</h3>
              <ul class="mistake-list">
                ${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function checkAnswer(id, answer, selector) {
  const exercise = exerciseById(id);
  const result = $(selector);
  const text = answer.trim();

  if (!exercise || !result) return;

  if (text.length < 30) {
    result.className = "result-box is-bad";
    result.textContent = "Aun no hay suficiente codigo para evaluar estructura.";
    return false;
  }

  const missing = missingRequirements(exercise, text);
  if (missing.length === 0) {
    result.className = "result-box is-good";
    result.textContent = "Estructura clave detectada. Ahora toca compilar y ajustar sintaxis.";
    return true;
  }

  const score = exercise.required.length - missing.length;
  result.className = missing.length <= 2 ? "result-box is-warn" : "result-box is-bad";
  result.textContent = `Detectado ${score}/${exercise.required.length}. Falta: ${missing
    .map(formatRequirement)
    .join(", ")}.`;
  return false;
}

function generateExam() {
  const chosen = [];
  for (const topic of topics) {
    const pool = exercises.filter((exercise) => exercise.topic === topic.id);
    chosen.push(pool[Math.floor(Math.random() * pool.length)].id);
  }

  const remaining = exercises.filter((exercise) => !chosen.includes(exercise.id));
  const extra = remaining[Math.floor(Math.random() * remaining.length)];
  if (extra) chosen.push(extra.id);

  state.examIds = chosen;
  state.examAnswers = {};
  save("examIds", state.examIds);
  save("examAnswers", state.examAnswers);
  showToast("Simulacro generado.");
  renderExam();
}

function startTimer() {
  const select = $("#duration-select");
  const minutes = select ? Number(select.value) : 90;
  state.examDuration = minutes * 60;
  state.examEnd = Date.now() + state.examDuration * 1000;
  save("examDuration", state.examDuration);
  save("examEnd", state.examEnd);
  updateExamTimer();
  showToast("Temporizador en marcha.");
}

function resetTimer() {
  state.examEnd = null;
  save("examEnd", state.examEnd);
  updateExamTimer();
}

function updateExamTimer() {
  const face = $("#timer-face");
  if (!face) return;

  let seconds = state.examDuration;
  if (state.examEnd) {
    seconds = Math.max(0, Math.ceil((state.examEnd - Date.now()) / 1000));
  }

  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  face.textContent = `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  face.style.background = seconds <= 300 && state.examEnd ? "var(--red-soft)" : "var(--gold-soft)";

  if (state.examEnd && seconds === 0) {
    state.examEnd = null;
    save("examEnd", state.examEnd);
    showToast("Tiempo terminado. Corrige por estructura.");
  }
}

function updateCountdown() {
  const now = new Date();
  const diff = EXAM_DATE - now;
  const targets = [$("#countdown"), $("#side-countdown")].filter(Boolean);

  if (diff <= 0) {
    targets.forEach((target) => {
      target.textContent = "Examen en curso o ya realizado";
    });
    return;
  }

  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes - days * 24 * 60) / 60);
  const minutes = totalMinutes % 60;
  const text = `${days}d ${hours}h ${minutes}m`;
  targets.forEach((target) => {
    target.textContent = text;
  });
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showToast("Copiado."));
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  showToast("Copiado.");
}

function scrollToExercise(id) {
  state.topic = exerciseById(id)?.topic || "all";
  setView("practice");
  window.requestAnimationFrame(() => {
    const target = $(`#exercise-${id}`);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function clearProgress() {
  if (!confirm("¿Reiniciar progreso, respuestas y simulacro?")) return;
  state.answers = {};
  state.examAnswers = {};
  state.mastered = {};
  state.plan = {};
  state.cardStatus = {};
  state.examIds = [];
  state.examEnd = null;
  save("answers", state.answers);
  save("examAnswers", state.examAnswers);
  save("mastered", state.mastered);
  save("plan", state.plan);
  save("cardStatus", state.cardStatus);
  save("examIds", state.examIds);
  save("examEnd", state.examEnd);
  showToast("Progreso reiniciado.");
  renderView(state.view);
}

document.addEventListener("click", (event) => {
  const viewLink = getClosestElement(event.target, "[data-view-link]");
  if (viewLink) {
    event.preventDefault();
    setView(viewLink.dataset.viewLink);
    return;
  }

  const action = getClosestElement(event.target, "[data-action]");
  if (!action) return;

  const id = action.dataset.id;

  switch (action.dataset.action) {
    case "filter-topic":
      state.topic = action.dataset.topic;
      renderPractice();
      break;
    case "filter-pattern-topic":
      state.patternTopic = action.dataset.topic;
      renderPatterns();
      break;
    case "check-exercise": {
      const answer = state.answers[id] || "";
      checkAnswer(id, answer, `[data-result="${id}"]`);
      break;
    }
    case "toggle-mastered":
      state.mastered[id] = !state.mastered[id];
      save("mastered", state.mastered);
      renderPractice();
      break;
    case "load-starter": {
      const exercise = exerciseById(id);
      const textarea = $(`[data-answer="${id}"]`);
      if (exercise && textarea) {
        textarea.value = exercise.starter;
        state.answers[id] = exercise.starter;
        save("answers", state.answers);
        showToast("Plantilla cargada.");
      }
      break;
    }
    case "copy-solution": {
      const exercise = exerciseById(id);
      if (exercise) copyText(exercise.solution);
      break;
    }
    case "open-exercise":
      scrollToExercise(id);
      break;
    case "go-practice":
      setView("practice");
      break;
    case "toggle-flash": {
      const card = $(`[data-flash-card="${id}"]`);
      if (card) card.classList.toggle("is-open");
      break;
    }
    case "card-review":
      state.cardStatus[id] = "repasar";
      save("cardStatus", state.cardStatus);
      renderPatterns();
      break;
    case "card-know":
      state.cardStatus[id] = "ok";
      save("cardStatus", state.cardStatus);
      renderPatterns();
      break;
    case "generate-exam":
      generateExam();
      break;
    case "check-exam-exercise": {
      const answer = state.examAnswers[id] || "";
      checkAnswer(id, answer, `[data-exam-result="${id}"]`);
      break;
    }
    case "check-exam":
      state.examIds.forEach((exerciseId) => {
        checkAnswer(exerciseId, state.examAnswers[exerciseId] || "", `[data-exam-result="${exerciseId}"]`);
      });
      break;
    case "start-timer":
      startTimer();
      break;
    case "reset-timer":
      resetTimer();
      break;
    case "clear-progress":
      clearProgress();
      break;
  }
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-answer]")) {
    const id = event.target.dataset.answer;
    state.answers[id] = event.target.value;
    save("answers", state.answers);
  }

  if (event.target.matches("[data-exam-answer]")) {
    const id = event.target.dataset.examAnswer;
    state.examAnswers[id] = event.target.value;
    save("examAnswers", state.examAnswers);
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-plan-id]")) {
    state.plan[event.target.dataset.planId] = event.target.checked;
    save("plan", state.plan);
    renderDashboard();
  }

  if (event.target.matches("#duration-select")) {
    state.examDuration = Number(event.target.value) * 60;
    save("examDuration", state.examDuration);
    updateExamTimer();
  }
});

function syncViewFromHash() {
  const hash = location.hash.replace("#", "");
  setView(getValidView(hash));
}

window.addEventListener("hashchange", syncViewFromHash);
window.addEventListener("popstate", syncViewFromHash);

renderTopicChips();
setView(getValidView(location.hash.replace("#", "")));
updateCountdown();
window.setInterval(updateCountdown, 30_000);
window.setInterval(updateExamTimer, 1_000);
