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
    },
};
