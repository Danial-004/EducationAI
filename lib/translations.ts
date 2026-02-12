export type Language = 'en' | 'ru' | 'kz';

export interface Translations {
    // Dashboard
    dashboard: string;
    availableCourses: string;
    coursesStarted: string;
    averageScore: string;
    questionsAnswered: string;
    activityOverview: string;
    signOut: string;
    theme: string;
    language: string;
    welcomeBack: string;
    hello: string;
    continueJourney: string;
    yourProgress: string;
    noCoursesYet: string;
    checkBackSoon: string;
    generateCourseButton: string;
    yourCourses: string;
    currentLevel: string;
    streak: string;
    totalXp: string;
    weeklyGoal: string;
    lessonsCompleted: string;
    days: string;
    keepItUp: string;
    topLearner: string;

    // Navigation
    signIn: string;

    // Course
    lesson: string;
    module: string;
    modules: string;
    videoLesson: string;
    readingMaterial: string;
    nextLesson: string;
    takeQuiz: string;
    startLearning: string;
    selectLessonToStart: string;

    // Activity/Progress
    noActivity: string;
    generatingContent: string;
    errorLoading: string;
    finalExam: string;
    bossLevel: string;

    // Quiz Client (Жаңалары)
    quizReadyTitle: string;
    quizReadyDesc: string;
    quizGenDesc: string;
    generatingQuiz: string;
    startQuizButton: string;

    // Landing Page (Басты бет)
    heroTitle: string;
    heroSubtitle: string;
    getStarted: string;
    featuresTitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;

}

export const translations: Record<Language, Translations> = {
    en: {
        dashboard: 'Dashboard',
        availableCourses: 'Available Courses',
        coursesStarted: 'Courses Started',
        averageScore: 'Average Score',
        questionsAnswered: 'Questions Answered',
        activityOverview: 'Activity Overview',
        signOut: 'Sign Out',
        theme: 'Theme',
        language: 'Language',
        welcomeBack: 'Welcome back!',
        hello: 'Hello',
        continueJourney: 'Continue your learning journey with AI-powered courses.',
        yourProgress: 'Your Progress',
        noCoursesYet: 'No courses available yet',
        checkBackSoon: 'Check back soon for new courses or create one with AI!',
        generateCourseButton: 'Generate Course with AI',
        signIn: 'Sign In',
        lesson: 'Lesson',
        module: 'Module',
        modules: 'Modules',
        videoLesson: 'Video Lesson',
        readingMaterial: 'Reading Material',
        nextLesson: 'Next Lesson',
        takeQuiz: 'Take Quiz',
        startLearning: 'Start Learning',
        selectLessonToStart: 'Select a lesson to start learning',
        noActivity: 'Complete quizzes to see your progress here',
        yourCourses: 'Your Courses',
        currentLevel: 'Current Level',
        streak: 'Daily Streak',
        totalXp: 'Total XP',
        weeklyGoal: 'Weekly Goal',
        lessonsCompleted: 'Lessons completed',
        days: 'Days',
        keepItUp: 'Keep the fire burning!',
        topLearner: 'Top 5% of learners',
        generatingContent: 'Generating lesson content with AI...',
        errorLoading: 'Error loading lesson',
        finalExam: 'Final Exam',
        bossLevel: 'BOSS',
        quizReadyTitle: 'Ready to Test Your Knowledge?',
        quizReadyDesc: 'Start the adaptive quiz and track your progress',
        quizGenDesc: "We'll generate personalized questions based on your lessons",
        generatingQuiz: 'Generating unique questions...',
        startQuizButton: 'Start Quiz',
        heroTitle: 'Master Any Subject with AI',
        heroSubtitle: 'Experience adaptive learning powered by cutting-edge AI. Get personalized quizzes, instant help, and track your progress.',
        getStarted: 'Get Started',
        featuresTitle: 'Everything you need to excel',
        feature1Title: 'Adaptive Tests',
        feature1Desc: 'AI-generated quizzes that adapt to your skill level.',
        feature2Title: 'AI Tutor',
        feature2Desc: 'Get instant help powered by AI.',
        feature3Title: 'Progress Tracking',
        feature3Desc: 'Monitor your learning journey with detailed analytics.',
    },
    ru: {
        dashboard: 'Панель управления',
        availableCourses: 'Доступные курсы',
        coursesStarted: 'Начатые курсы',
        averageScore: 'Средний балл',
        questionsAnswered: 'Отвеченные вопросы',
        activityOverview: 'Обзор активности',
        signOut: 'Выйти',
        theme: 'Тема',
        language: 'Язык',
        welcomeBack: 'С возвращением!',
        hello: 'Привет',
        continueJourney: 'Продолжайте своё обучение с помощью курсов на основе ИИ.',
        yourProgress: 'Ваш прогресс',
        noCoursesYet: 'Курсы пока недоступны',
        checkBackSoon: 'Вернитесь позже для новых курсов или создайте свой с помощью ИИ!',
        generateCourseButton: 'Создать курс с ИИ',
        signIn: 'Войти',
        lesson: 'Урок',
        module: 'Модуль',
        modules: 'Модули',
        videoLesson: 'Видео урок',
        readingMaterial: 'Материал для чтения',
        nextLesson: 'Следующий урок',
        takeQuiz: 'Пройти тест',
        startLearning: 'Начать обучение',
        selectLessonToStart: 'Выберите урок, чтобы начать обучение',
        noActivity: 'Пройдите тесты, чтобы увидеть свой прогресс',
        yourCourses: 'Ваши курсы',
        currentLevel: 'Текущий уровень',
        streak: 'Дневная серия',
        totalXp: 'Всего XP',
        weeklyGoal: 'Еженедельная цель',
        lessonsCompleted: 'Уроков завершено',
        days: 'Дней',
        keepItUp: 'Так держать!',
        topLearner: 'Топ 5% учеников',
        generatingContent: 'Генерация контента с ИИ...',
        errorLoading: 'Ошибка загрузки урока',
        finalExam: 'Финальный экзамен',
        bossLevel: 'БОСС',
        quizReadyTitle: 'Готовы проверить знания?',
        quizReadyDesc: 'Начните адаптивный тест и отслеживайте прогресс',
        quizGenDesc: "Мы создадим персональные вопросы на основе ваших уроков",
        generatingQuiz: 'Создание уникальных вопросов...',
        startQuizButton: 'Начать тест',
        heroTitle: 'Освойте любой предмет с ИИ',
        heroSubtitle: 'Адаптивное обучение на базе передового ИИ. Персональные тесты, мгновенная помощь и отслеживание прогресса.',
        getStarted: 'Начать',
        featuresTitle: 'Всё, что нужно для успеха',
        feature1Title: 'Адаптивные тесты',
        feature1Desc: 'Тесты от ИИ, которые подстраиваются под ваш уровень.',
        feature2Title: 'AI Репетитор',
        feature2Desc: 'Мгновенная помощь на базе ИИ.',
        feature3Title: 'Отслеживание прогресса',
        feature3Desc: 'Следите за своим обучением с подробной аналитикой.',
    },
    kz: {
        dashboard: 'Басқару тақтасы',
        availableCourses: 'Қолжетімді курстар',
        coursesStarted: 'Бастаған курстар',
        averageScore: 'Орташа балл',
        questionsAnswered: 'Жауап берілген сұрақтар',
        activityOverview: 'Белсенділікке шолу',
        signOut: 'Шығу',
        theme: 'Тақырып',
        language: 'Тіл',
        welcomeBack: 'Қайта оралуыңызбен!',
        hello: 'Сәлем',
        continueJourney: 'ЖИ негізіндегі курстармен оқуды жалғастырыңыз.',
        yourProgress: 'Сіздің прогресс',
        noCoursesYet: 'Курстар әлі қолжетімді емес',
        checkBackSoon: 'Жаңа курстар үшін кейінірек қайта келіңіз немесе ЖИ көмегімен жасаңыз!',
        generateCourseButton: 'ЖИ арқылы курс жасау',
        signIn: 'Кіру',
        lesson: 'Сабақ',
        module: 'Модуль',
        modules: 'Модульдер',
        videoLesson: 'Бейне сабақ',
        readingMaterial: 'Оқу материалы',
        nextLesson: 'Келесі сабақ',
        takeQuiz: 'Тест тапсыру',
        startLearning: 'Оқуды бастау',
        selectLessonToStart: 'Оқуды бастау үшін сабақты таңдаңыз',
        noActivity: 'Прогресті көру үшін тестерді тапсырыңыз',
        yourCourses: 'Сіздің курстарыңыз',
        currentLevel: 'Ағымдағы деңгей',
        streak: 'Үздіксіздік',
        totalXp: 'Жалпы XP',
        weeklyGoal: 'Апталық мақсат',
        lessonsCompleted: 'Аяқталған сабақтар',
        days: 'Күн',
        keepItUp: 'Жарайсың, осылай жалғастыр!',
        topLearner: 'Оқушылардың үздік 5%-ы',
        generatingContent: 'ЖИ көмегімен мазмұн жасалуда...',
        errorLoading: 'Сабақты жүктеу қатесі',
        finalExam: 'Қорытынды емтихан',
        bossLevel: 'ФИНАЛ',
        quizReadyTitle: 'Біліміңізді тексеруге дайынсыз ба?',
        quizReadyDesc: 'Адаптивті тестті бастаңыз және прогресті бақылаңыз',
        quizGenDesc: "Біз сабақтарыңызға негізделген жеке сұрақтарды құрастырамыз",
        generatingQuiz: 'Бірегей сұрақтар жасалуда...',
        startQuizButton: 'Тестті бастау',
        heroTitle: 'ЖИ көмегімен кез келген пәнді меңгеріңіз',
        heroSubtitle: 'Жасанды интеллект негізіндегі адаптивті оқыту. Жеке тесттер, жылдам көмек және прогресті қадағалау.',
        getStarted: 'Бастау',
        featuresTitle: 'Жетістікке жету үшін қажеттінің бәрі',
        feature1Title: 'Адаптивті тесттер',
        feature1Desc: 'Сіздің деңгейіңізге бейімделетін ЖИ құрастырған тесттер.',
        feature2Title: 'AI Тьютор',
        feature2Desc: 'ЖИ негізіндегі жылдам көмек.',
        feature3Title: 'Прогресті бақылау',
        feature3Desc: 'Толық аналитика арқылы оқу жолыңызды қадағалаңыз.',
    },
};
