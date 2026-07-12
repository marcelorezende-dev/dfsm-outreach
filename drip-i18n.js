/* ============================================================================
   DFSA — lightweight i18n / auto-translation layer
   Source language: English. Adds Spanish, French, Russian, Arabic, Chinese.
   Strategy: a translation-memory keyed by the page's own English text, applied
   in place over the live DOM. Acronyms & proper nouns (DFSA, FAO, GEF, DSL-IP,
   ILAM, SLPF, REM, NDVI …) are deliberately left untranslated.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- normalisation: collapse whitespace, straighten quotes ------------- */
  function norm(s) {
    return (s || "")
      .replace(/\u00a0/g, " ")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\s+/g, " ")
      .trim();
  }

  /* ---- translation memory: one row per phrase --------------------------- */
  /* row = [ EN, ES, FR, RU, AR, ZH ] */
  var ROWS = [
    // ===== nav / brand =====
    ["Dryland Forest Support Accelerator",
      "Aceleradora de Apoyo a los Bosques de Tierras Secas",
      "Accélérateur de soutien aux forêts des terres arides",
      "Акселератор поддержки лесов засушливых земель",
      "مسرِّع دعم غابات الأراضي الجافة",
      "旱地森林支持加速器"],
    ["About", "Acerca de", "À propos", "О платформе", "نبذة", "关于"],
    ["Why Drylands", "Por qué las tierras secas", "Pourquoi les terres arides", "Почему засушливые земли", "لماذا الأراضي الجافة", "为何关注旱地"],
    ["Map", "Mapa", "Carte", "Карта", "الخريطة", "地图"],
    ["Library", "Biblioteca", "Bibliothèque", "Библиотека", "المكتبة", "资源库"],
    ["Research", "Investigación", "Recherche", "Исследования", "البحوث", "研究"],
    ["Transparency & Data Policy",
      "Transparencia y política de datos",
      "Transparence et politique des données",
      "Прозрачность и политика данных",
      "الشفافية وسياسة البيانات",
      "透明度与数据政策"],
    ["⌂ Home", "⌂ Inicio", "⌂ Accueil", "⌂ Главная", "⌂ الرئيسية", "⌂ 首页"],

    // ===== hero =====
    ["Hosted by FAO's Sustainable Forest Management Impact Program on Drylands Sustainable Landscapes",
      "Alojada por el Programa de Impacto de la FAO sobre Gestión Forestal Sostenible en Paisajes Sostenibles de Tierras Secas",
      "Hébergée par le Programme d'impact de la FAO sur la gestion durable des forêts dans les paysages durables des terres arides",
      "Размещено Программой ФАО по устойчивому управлению лесами в рамках устойчивых ландшафтов засушливых земель",
      "تستضيفها منظمة الأغذية والزراعة (الفاو) ضمن برنامج الأثر للإدارة المستدامة للغابات في المناظر الطبيعية المستدامة للأراضي الجافة",
      "由联合国粮农组织（FAO）可持续森林管理影响计划托管，服务于旱地可持续景观"],
    ["A funded but dormant asset, reawakened. DFSA is being activated as the Programme's dedicated knowledge platform on drylands — a single home where the research, frameworks, monitoring and stories of the Drylands Sustainable Landscapes Impact Program live, connect and stay alive.",
      "Un activo financiado pero inactivo, ahora reactivado. DFSA se está activando como la plataforma de conocimiento dedicada del Programa sobre tierras secas: un único hogar donde la investigación, los marcos, el seguimiento y las historias del Programa de Impacto de Paisajes Sostenibles de Tierras Secas viven, se conectan y se mantienen activos.",
      "Un actif financé mais dormant, réactivé. DFSA est activée comme la plateforme de connaissances dédiée du Programme sur les terres arides : un lieu unique où la recherche, les cadres, le suivi et les récits du Programme d'impact pour des paysages durables en terres arides vivent, se connectent et restent vivants.",
      "Профинансированный, но бездействующий актив, пробуждённый вновь. DFSA активируется как специализированная платформа знаний Программы по засушливым землям — единый дом, где исследования, концепции, мониторинг и истории Программы устойчивых ландшафтов засушливых земель живут, связываются и остаются живыми.",
      "أصل مُموَّل لكنه كان خاملاً، وقد أُعيد إيقاظه. يجري تفعيل DFSA لتكون منصة المعرفة المخصّصة للبرنامج بشأن الأراضي الجافة — موطن واحد تعيش فيه بحوث وأطر ورصد وقصص برنامج الأثر للمناظر الطبيعية المستدامة للأراضي الجافة وتترابط وتبقى حيّة.",
      "一项已获资助却长期沉睡的资产，如今被重新唤醒。DFSA 正被启用为本项目专门的旱地知识平台——让旱地可持续景观影响计划的研究、框架、监测与故事在同一个家园中存续、连接并保持活力。"],

    // ===== 01 activation =====
    ["Activating a dormant asset",
      "Activar un activo inactivo", "Activer un actif dormant",
      "Активация бездействующего актива", "تفعيل أصل خامل", "唤醒一项沉睡的资产"],
    ["DFSA already exists and is already funded — it has simply never been switched on. This initiative turns that latent investment into a living platform, and works to institutionalise it back into the Drylands Program on a durable, perhaps innovative, funding stream.",
      "DFSA ya existe y ya está financiada: simplemente nunca se ha puesto en marcha. Esta iniciativa convierte esa inversión latente en una plataforma viva y trabaja para institucionalizarla de nuevo dentro del Programa de Tierras Secas con una fuente de financiación duradera y, quizás, innovadora.",
      "DFSA existe déjà et est déjà financée — elle n'a tout simplement jamais été mise en marche. Cette initiative transforme cet investissement latent en une plateforme vivante et œuvre à la réintégrer durablement dans le Programme des terres arides grâce à un flux de financement pérenne, voire innovant.",
      "DFSA уже существует и уже профинансирована — её просто никогда не включали. Эта инициатива превращает скрытую инвестицию в живую платформу и работает над тем, чтобы институционализировать её обратно в Программу засушливых земель на устойчивом, возможно инновационном, источнике финансирования.",
      "إنّ DFSA موجودة بالفعل ومُموَّلة بالفعل — لكنها ببساطة لم تُشغَّل قط. تحوِّل هذه المبادرة ذلك الاستثمار الكامن إلى منصة حيّة، وتعمل على إعادة ترسيخه مؤسسيًا داخل برنامج الأراضي الجافة عبر مصدر تمويل مستدام، وربما مبتكر.",
      "DFSA 早已存在，也早已获得资助——只是从未被开启。本倡议将这项潜在投资转化为一个鲜活的平台，并致力于通过可持续、或许具有创新性的资金来源，将其重新制度化地纳入旱地项目。"],
    ["Phase 1 · where we are", "Fase 1 · dónde estamos", "Phase 1 · où nous en sommes",
      "Этап 1 · где мы сейчас", "المرحلة 1 · أين نحن", "阶段 1 · 现状"],
    ["Dormant", "Inactiva", "Dormante", "Бездействует", "خامل", "沉睡"],
    ["A funded platform that was never put to use. The mandate and the money exist; the activity does not. The asset sits idle while drylands knowledge stays scattered across documents, drives and inboxes.",
      "Una plataforma financiada que nunca se utilizó. El mandato y el dinero existen; la actividad no. El activo permanece inactivo mientras el conocimiento sobre tierras secas sigue disperso en documentos, unidades y bandejas de entrada.",
      "Une plateforme financée qui n'a jamais été utilisée. Le mandat et l'argent existent ; l'activité, non. L'actif reste inerte tandis que le savoir sur les terres arides demeure dispersé dans des documents, des disques et des boîtes de réception.",
      "Профинансированная платформа, которую так и не использовали. Мандат и деньги есть; деятельности нет. Актив простаивает, пока знания о засушливых землях разбросаны по документам, дискам и почтовым ящикам.",
      "منصة مُموَّلة لم تُستخدَم قط. التفويض والمال موجودان؛ أما النشاط فلا. يبقى الأصل خاملاً بينما تظل المعارف المتعلقة بالأراضي الجافة مبعثرة عبر المستندات والأقراص وصناديق البريد.",
      "一个获得资助却从未投入使用的平台。授权与资金都在，活动却没有。当旱地知识散落在各类文档、网盘与收件箱中时，这项资产却闲置着。"],
    ["Phase 2 · this initiative", "Fase 2 · esta iniciativa", "Phase 2 · cette initiative",
      "Этап 2 · эта инициатива", "المرحلة 2 · هذه المبادرة", "阶段 2 · 本倡议"],
    ["Activate", "Activar", "Activer", "Активировать", "تفعيل", "启用"],
    ["Switch DFSA on as a dedicated drylands knowledge platform — gathering the Programme's frameworks, assessments, monitoring and stories into one navigable home, with the Constellation as its living map.",
      "Poner en marcha DFSA como plataforma de conocimiento dedicada a las tierras secas, reuniendo los marcos, evaluaciones, seguimiento e historias del Programa en un único hogar navegable, con la Constelación como su mapa vivo.",
      "Mettre en marche DFSA comme plateforme de connaissances dédiée aux terres arides, en réunissant les cadres, les évaluations, le suivi et les récits du Programme dans un lieu unique et navigable, avec la Constellation comme carte vivante.",
      "Включить DFSA как специализированную платформу знаний о засушливых землях, собрав концепции, оценки, мониторинг и истории Программы в единый удобный дом, где Созвездие служит её живой картой.",
      "تشغيل DFSA بوصفها منصة معرفة مخصّصة للأراضي الجافة — تجمع أطر البرنامج وتقييماته ورصده وقصصه في موطن واحد سهل التصفّح، مع «الكوكبة» بوصفها خريطته الحيّة.",
      "将 DFSA 启用为专门的旱地知识平台——把本项目的框架、评估、监测与故事汇聚到一个可导航的家园中，并以「星座」作为其鲜活的地图。"],
    ["Phase 3 · the goal", "Fase 3 · el objetivo", "Phase 3 · l'objectif",
      "Этап 3 · цель", "المرحلة 3 · الهدف", "阶段 3 · 目标"],
    ["Institutionalise", "Institucionalizar", "Institutionnaliser",
      "Институционализировать", "الترسيخ المؤسسي", "制度化"],
    ["Embed DFSA back into the Drylands Program as standing infrastructure — leveraging the DSL-IP knowledge-management structure so its upkeep sits inside the Programme's mandate.",
      "Integrar de nuevo DFSA en el Programa de Tierras Secas como infraestructura permanente, aprovechando la estructura de gestión del conocimiento del DSL-IP para que su mantenimiento forme parte del mandato del Programa.",
      "Réintégrer DFSA dans le Programme des terres arides comme infrastructure permanente, en s'appuyant sur la structure de gestion des connaissances du DSL-IP afin que son entretien relève du mandat du Programme.",
      "Встроить DFSA обратно в Программу засушливых земель как постоянную инфраструктуру, опираясь на структуру управления знаниями DSL-IP, чтобы её содержание входило в мандат Программы.",
      "إعادة دمج DFSA في برنامج الأراضي الجافة بوصفها بنية تحتية دائمة — بالاستفادة من هيكل إدارة المعارف في DSL-IP بحيث تقع صيانتها ضمن تفويض البرنامج.",
      "将 DFSA 重新嵌入旱地项目，作为常设基础设施——依托 DSL-IP 的知识管理架构，使其维护纳入本项目的职责。"],
    ["From a monitoring tool to a knowledge platform",
      "De una herramienta de seguimiento a una plataforma de conocimiento",
      "D'un outil de suivi à une plateforme de connaissances",
      "От инструмента мониторинга к платформе знаний",
      "من أداة رصد إلى منصة معرفة",
      "从监测工具到知识平台"],
    ["DFSA is not a new idea. It grew from the Rome Promise on Monitoring and Assessment of Drylands (2015–2016) and was first implemented by FAO in 2016 as an interactive web portal — the Dryland Restoration Initiative Platform, a monitoring and reporting tool helping practitioners compile, analyse and share lessons from dryland restoration. In 2019 it was brought before FAO's COFO Working Group on Dryland Forests and Agrosilvopastoral Systems, with a mandate to grow into a comprehensive, easy-to-use tool linked to the Land Degradation Neutrality (LDN) framework and FAO's Sustainable Forest Management Toolbox.",
      "DFSA no es una idea nueva. Surgió de la Promesa de Roma sobre Seguimiento y Evaluación de las Tierras Secas (2015–2016) y la FAO la implementó por primera vez en 2016 como un portal web interactivo: la Dryland Restoration Initiative Platform, una herramienta de seguimiento y notificación que ayudaba a los profesionales a recopilar, analizar y compartir lecciones de la restauración de tierras secas. En 2019 se presentó ante el Grupo de Trabajo del COFO de la FAO sobre Bosques de Tierras Secas y Sistemas Agrosilvopastoriles, con el mandato de convertirse en una herramienta integral y fácil de usar, vinculada al marco de Neutralidad en la Degradación de las Tierras (NDT) y a la Caja de Herramientas de Gestión Forestal Sostenible de la FAO.",
      "DFSA n'est pas une idée nouvelle. Elle est née de la Promesse de Rome sur le suivi et l'évaluation des terres arides (2015–2016) et a d'abord été mise en œuvre par la FAO en 2016 sous la forme d'un portail web interactif — la Dryland Restoration Initiative Platform, un outil de suivi et de rapportage aidant les praticiens à compiler, analyser et partager les enseignements de la restauration des terres arides. En 2019, elle a été présentée au Groupe de travail du COFO de la FAO sur les forêts des terres arides et les systèmes agrosylvopastoraux, avec pour mandat de devenir un outil complet et facile d'emploi, lié au cadre de la Neutralité en matière de dégradation des terres (NDT) et à la Boîte à outils de gestion durable des forêts de la FAO.",
      "DFSA — не новая идея. Она выросла из Римского обязательства по мониторингу и оценке засушливых земель (2015–2016) и впервые была реализована ФАО в 2016 году как интерактивный веб-портал — Dryland Restoration Initiative Platform, инструмент мониторинга и отчётности, помогавший практикам собирать, анализировать и распространять уроки восстановления засушливых земель. В 2019 году она была представлена Рабочей группе КОФО ФАО по лесам засушливых земель и агросильвопасторальным системам с мандатом превратиться во всеобъемлющий и удобный инструмент, связанный с концепцией нейтрального баланса деградации земель (НБДЗ) и Инструментарием устойчивого лесопользования ФАО.",
      "ليست DFSA فكرة جديدة. فقد نشأت من «وعد روما» بشأن رصد وتقييم الأراضي الجافة (2015–2016)، ونفّذتها الفاو لأول مرة في عام 2016 بوصفها بوابة وِب تفاعلية — Dryland Restoration Initiative Platform، وهي أداة رصد وإبلاغ تساعد الممارسين على تجميع الدروس المستفادة من استصلاح الأراضي الجافة وتحليلها وتبادلها. وفي عام 2019 عُرِضت على فريق عمل لجنة الغابات (COFO) التابع للفاو المعني بغابات الأراضي الجافة ونظم الزراعة الحراجية الرعوية، مع تكليفها بأن تتطور إلى أداة شاملة وسهلة الاستخدام مرتبطة بإطار تحييد تدهور الأراضي (LDN) وحقيبة أدوات الفاو للإدارة المستدامة للغابات.",
      "DFSA 并非新构想。它源自《罗马承诺——旱地监测与评估》（2015–2016），并由粮农组织于 2016 年首次实施，成为一个交互式网络门户——旱地恢复倡议平台（Dryland Restoration Initiative Platform），一项帮助从业者汇总、分析并分享旱地恢复经验的监测与报告工具。2019 年，它被提交至粮农组织林业委员会（COFO）旱地森林与农林牧系统工作组，其任务是发展成一个全面易用、与「土地退化零净增长」（LDN）框架及粮农组织可持续森林管理工具箱相衔接的工具。"],
    ["In the seven years since it was conceptualized, the UN Decade on Ecosystem Restoration reshaped the field: FAO's restoration-monitoring function was consolidated into the global FERM platform (Framework for Ecosystem Restoration Monitoring). DFSA's original reporting role found a durable home there — freeing DFSA to become what the drylands community still lacked: a dedicated knowledge and research platform, focused not on logging projects but on accelerating sustainable management and restoration across drylands.",
      "En los siete años transcurridos desde que se concibió, el Decenio de las Naciones Unidas sobre la Restauración de los Ecosistemas transformó el campo: la función de seguimiento de la restauración de la FAO se consolidó en la plataforma mundial FERM (Marco para el Seguimiento de la Restauración de Ecosistemas). El papel original de notificación de DFSA encontró allí un hogar duradero, lo que liberó a DFSA para convertirse en lo que la comunidad de las tierras secas aún no tenía: una plataforma dedicada de conocimiento e investigación, centrada no en registrar proyectos, sino en acelerar la gestión sostenible y la restauración en las tierras secas.",
      "Au cours des sept années écoulées depuis sa conception, la Décennie des Nations Unies pour la restauration des écosystèmes a remodelé le domaine : la fonction de suivi de la restauration de la FAO a été regroupée au sein de la plateforme mondiale FERM (Cadre de suivi de la restauration des écosystèmes). Le rôle initial de rapportage de DFSA y a trouvé un foyer durable — libérant DFSA pour devenir ce qui manquait encore à la communauté des terres arides : une plateforme dédiée de connaissances et de recherche, axée non sur l'enregistrement de projets mais sur l'accélération de la gestion durable et de la restauration des terres arides.",
      "За семь лет, прошедших с момента её замысла, Десятилетие ООН по восстановлению экосистем преобразило эту область: функция мониторинга восстановления ФАО была объединена в глобальную платформу FERM (Концепция мониторинга восстановления экосистем). Изначальная отчётная роль DFSA нашла там надёжный дом, что позволило DFSA стать тем, чего сообществу засушливых земель всё ещё не хватало: специализированной платформой знаний и исследований, нацеленной не на учёт проектов, а на ускорение устойчивого управления и восстановления засушливых земель.",
      "خلال السنوات السبع منذ بلورة الفكرة، أعاد عقد الأمم المتحدة لاستعادة النظم الإيكولوجية تشكيل هذا المجال: فقد جُمِّعت وظيفة رصد الاستصلاح لدى الفاو ضمن منصة FERM العالمية (إطار رصد استعادة النظم الإيكولوجية). ووجد دور الإبلاغ الأصلي لـ DFSA موطنًا دائمًا هناك — مما حرّر DFSA لتصبح ما كان لا يزال ينقص مجتمع الأراضي الجافة: منصة مكرّسة للمعرفة والبحث، تركّز لا على تسجيل المشاريع بل على تسريع الإدارة المستدامة والاستصلاح في الأراضي الجافة.",
      "在构想成形后的七年间，「联合国生态系统恢复十年」重塑了这一领域：粮农组织的恢复监测职能被整合进全球 FERM 平台（生态系统恢复监测框架）。DFSA 最初的报告职能在那里找到了长久的归宿——从而让 DFSA 得以成为旱地社区仍然缺少的事物：一个专门的知识与研究平台，重点不在于登记项目，而在于加速旱地的可持续管理与恢复。"],
    ["Rome Promise on dryland monitoring & assessment",
      "Promesa de Roma sobre seguimiento y evaluación de tierras secas",
      "Promesse de Rome sur le suivi et l'évaluation des terres arides",
      "Римское обязательство по мониторингу и оценке засушливых земель",
      "وعد روما بشأن رصد وتقييم الأراضي الجافة",
      "《罗马承诺》：旱地监测与评估"],
    ["DFSA launched as a restoration monitoring tool",
      "DFSA se lanza como herramienta de seguimiento de la restauración",
      "DFSA lancée comme outil de suivi de la restauration",
      "DFSA запущена как инструмент мониторинга восстановления",
      "إطلاق DFSA كأداة لرصد الاستصلاح",
      "DFSA 作为恢复监测工具上线"],
    ["Brought to the COFO Working Group on Dryland Forests",
      "Presentada al Grupo de Trabajo del COFO sobre Bosques de Tierras Secas",
      "Présentée au Groupe de travail du COFO sur les forêts des terres arides",
      "Представлена Рабочей группе КОФО по лесам засушливых земель",
      "عُرِضت على فريق عمل COFO المعني بغابات الأراضي الجافة",
      "提交至 COFO 旱地森林工作组"],
    ["UN Decade on Ecosystem Restoration · FERM platform",
      "Decenio de la ONU sobre Restauración de Ecosistemas · plataforma FERM",
      "Décennie des Nations Unies pour la restauration des écosystèmes · plateforme FERM",
      "Десятилетие ООН по восстановлению экосистем · платформа FERM",
      "عقد الأمم المتحدة لاستعادة النظم الإيكولوجية · منصة FERM",
      "联合国生态系统恢复十年 · FERM 平台"],
    ["Reactivated as a drylands knowledge platform",
      "Reactivada como plataforma de conocimiento sobre tierras secas",
      "Réactivée comme plateforme de connaissances sur les terres arides",
      "Вновь активирована как платформа знаний о засушливых землях",
      "أُعيد تفعيلها كمنصة معرفة للأراضي الجافة",
      "重新启用为旱地知识平台"],
    ["Four lenses on dryland acceleration",
      "Cuatro enfoques sobre la aceleración en tierras secas",
      "Quatre regards sur l'accélération en terres arides",
      "Четыре ракурса ускорения в засушливых землях",
      "أربع عدسات لتسريع العمل في الأراضي الجافة",
      "审视旱地加速的四个视角"],
    ["Reactivated, DFSA supports the acceleration of sustainable management and restoration in drylands — seen through four lenses.",
      "Reactivada, DFSA apoya la aceleración de la gestión sostenible y la restauración en las tierras secas, vista a través de cuatro enfoques.",
      "Réactivée, DFSA soutient l'accélération de la gestion durable et de la restauration des terres arides — vue à travers quatre regards.",
      "Будучи вновь активированной, DFSA поддерживает ускорение устойчивого управления и восстановления засушливых земель — через четыре ракурса.",
      "بعد إعادة تفعيلها، تدعم DFSA تسريع الإدارة المستدامة والاستصلاح في الأراضي الجافة — من خلال أربع عدسات.",
      "重新启用后，DFSA 从四个视角出发，支持加速旱地的可持续管理与恢复。"],
    ["Innovation", "Innovación", "Innovation", "Инновации", "الابتكار", "创新"],
    ["New tools, methods and funding models, tested in the open.",
      "Nuevas herramientas, métodos y modelos de financiación, probados de forma abierta.",
      "De nouveaux outils, méthodes et modèles de financement, testés au grand jour.",
      "Новые инструменты, методы и модели финансирования, испытываемые открыто.",
      "أدوات وأساليب ونماذج تمويل جديدة، تُختبَر علنًا.",
      "在公开中检验的新工具、新方法与新筹资模式。"],
    ["Empirical R&D", "I+D empírica", "R&D empirique", "Эмпирические НИОКР", "بحث وتطوير تجريبي", "实证研发"],
    ["Field research and experimentation that test what actually works.",
      "Investigación de campo y experimentación que ponen a prueba lo que realmente funciona.",
      "Recherche de terrain et expérimentation qui testent ce qui fonctionne réellement.",
      "Полевые исследования и эксперименты, проверяющие то, что действительно работает.",
      "بحوث ميدانية وتجارب تختبر ما ينجح فعليًا.",
      "通过田间研究与实验检验真正有效的做法。"],
    ["Evidence-based", "Basada en evidencias", "Fondée sur les preuves", "На основе доказательств", "قائم على الأدلة", "以证据为本"],
    ["Every claim sourced, validated and kept current.",
      "Cada afirmación tiene su fuente, está validada y se mantiene actualizada.",
      "Chaque affirmation est sourcée, validée et tenue à jour.",
      "Каждое утверждение подкреплено источником, проверено и поддерживается в актуальном состоянии.",
      "كل ادعاء موثّق المصدر ومُتحقَّق منه ومُحدَّث باستمرار.",
      "每一项论断都有出处、经过验证并保持更新。"],
    ["Integrated & systemic", "Integrada y sistémica", "Intégré et systémique", "Целостный и системный", "متكامل ومنهجي", "整合与系统"],
    ["Drylands seen as connected complex systems, not isolated parts.",
      "Las tierras secas vistas como sistemas complejos conectados, no como partes aisladas.",
      "Les terres arides vues comme des systèmes complexes connectés, et non des parties isolées.",
      "Засушливые земли как взаимосвязанные сложные системы, а не изолированные части.",
      "يُنظَر إلى الأراضي الجافة بوصفها نظمًا معقّدة مترابطة، لا أجزاءً منعزلة.",
      "把旱地视为相互关联的复杂系统，而非孤立的部分。"],

    // ===== 02 pillars =====
    ["The seven pillars", "Los siete pilares", "Les sept piliers", "Семь столпов", "الركائز السبع", "七大支柱"],
    ["DFSA organises everything it holds under seven pillars of dryland knowledge. Choose a pillar to filter the library below — or open a pillar to explore its frameworks, modules and programmes.",
      "DFSA organiza todo lo que reúne en siete pilares de conocimiento sobre tierras secas. Elija un pilar para filtrar la biblioteca de abajo, o abra un pilar para explorar sus marcos, módulos y programas.",
      "DFSA organise tout ce qu'elle rassemble en sept piliers de connaissances sur les terres arides. Choisissez un pilier pour filtrer la bibliothèque ci-dessous — ou ouvrez un pilier pour explorer ses cadres, modules et programmes.",
      "DFSA организует всё, что собирает, по семи столпам знаний о засушливых землях. Выберите столп, чтобы отфильтровать библиотеку ниже, или откройте столп, чтобы изучить его концепции, модули и программы.",
      "تنظِّم DFSA كل ما تحتويه ضمن سبع ركائز للمعرفة بالأراضي الجافة. اختر ركيزة لتصفية المكتبة أدناه — أو افتح ركيزة لاستكشاف أطرها ووحداتها وبرامجها.",
      "DFSA 将其汇聚的一切归纳为旱地知识的七大支柱。选择某一支柱以筛选下方的资料库，或打开该支柱以浏览其框架、模块与项目。"],
    // pillar names + descriptions
    ["Coordination & Exchange", "Coordinación e intercambio", "Coordination et échange", "Координация и обмен", "التنسيق والتبادل", "协调与交流"],
    ["How the Programme aligns, pools expertise and docks with countries.",
      "Cómo el Programa se alinea, reúne experiencia y se conecta con los países.",
      "Comment le Programme s'aligne, met en commun l'expertise et s'arrime aux pays.",
      "Как Программа согласуется, объединяет экспертизу и стыкуется со странами.",
      "كيف يحقّق البرنامج المواءمة ويجمع الخبرات ويتصل بالبلدان.",
      "本项目如何协调一致、汇聚专长并与各国对接。"],
    ["Assessment & Evidence", "Evaluación y evidencia", "Évaluation et preuves", "Оценка и доказательства", "التقييم والأدلة", "评估与证据"],
    ["The evidence base — what a landscape needs, measured.",
      "La base de evidencias: lo que un paisaje necesita, medido.",
      "La base de preuves — ce dont un paysage a besoin, mesuré.",
      "База доказательств — то, что нужно ландшафту, измеренное.",
      "قاعدة الأدلة — ما يحتاجه المنظر الطبيعي، مقيسًا.",
      "证据基础——以量化方式衡量景观所需。"],
    ["Integrated Management", "Gestión integrada", "Gestion intégrée", "Комплексное управление", "الإدارة المتكاملة", "综合管理"],
    ["Managing land, forests and farms as one system — producing without degrading.",
      "Gestionar tierras, bosques y fincas como un solo sistema: producir sin degradar.",
      "Gérer terres, forêts et exploitations comme un seul système — produire sans dégrader.",
      "Управлять землёй, лесами и хозяйствами как единой системой — производить без деградации.",
      "إدارة الأراضي والغابات والمزارع كنظام واحد — إنتاج دون تدهور.",
      "将土地、森林与农场作为一个系统统筹管理——在不退化的前提下生产。"],
    ["Gender & Inclusion", "Género e inclusión", "Genre et inclusion", "Гендер и инклюзия", "النوع الاجتماعي والإدماج", "性别与包容"],
    ["Women's leadership and social inclusion at the centre.",
      "El liderazgo de las mujeres y la inclusión social en el centro.",
      "Le leadership des femmes et l'inclusion sociale au centre.",
      "Лидерство женщин и социальная инклюзия в центре внимания.",
      "قيادة المرأة والإدماج الاجتماعي في صميم العمل.",
      "以女性领导力与社会包容为核心。"],
    ["Monitoring & Learning", "Seguimiento y aprendizaje", "Suivi et apprentissage", "Мониторинг и обучение", "الرصد والتعلّم", "监测与学习"],
    ["Tracking results and feeding lessons back.",
      "Hacer seguimiento de los resultados y retroalimentar las lecciones.",
      "Suivre les résultats et réinjecter les enseignements.",
      "Отслеживание результатов и возврат уроков в работу.",
      "تتبّع النتائج وإعادة الدروس المستفادة إلى العمل.",
      "追踪成果并将经验反馈回流。"],
    ["Knowledge & Outreach", "Conocimiento y difusión", "Connaissances et diffusion", "Знания и распространение", "المعرفة والتوعية", "知识与推广"],
    ["Capturing, connecting and sharing what we learn.",
      "Captar, conectar y compartir lo que aprendemos.",
      "Capter, relier et partager ce que nous apprenons.",
      "Сбор, связывание и распространение того, что мы узнаём.",
      "التقاط ما نتعلّمه وربطه وتبادله.",
      "采集、连接并分享我们所学。"],
    ["Finance & Governance", "Financiación y gobernanza", "Financement et gouvernance", "Финансы и управление", "التمويل والحوكمة", "资金与治理"],
    ["How the work is funded, governed and sustained.",
      "Cómo se financia, gobierna y sostiene el trabajo.",
      "Comment le travail est financé, gouverné et pérennisé.",
      "Как работа финансируется, управляется и поддерживается.",
      "كيف يُموَّل العمل ويُحكَم ويُستدام.",
      "工作如何获得资助、治理与维系。"],
    ["Open pillar", "Abrir pilar", "Ouvrir le pilier", "Открыть столп", "افتح الركيزة", "打开支柱"],
    ["Filter", "Filtrar", "Filtrer", "Фильтр", "تصفية", "筛选"],

    // ===== 03 library =====
    ["The knowledge library", "La biblioteca de conocimiento", "La bibliothèque de connaissances", "Библиотека знаний", "مكتبة المعرفة", "知识库"],
    ["Everything DFSA brings together, in one place. Each item is a living piece of the Programme's knowledge — open any one to explore it.",
      "Todo lo que DFSA reúne, en un solo lugar. Cada elemento es una pieza viva del conocimiento del Programa: abra cualquiera para explorarlo.",
      "Tout ce que DFSA rassemble, en un seul endroit. Chaque élément est une pièce vivante du savoir du Programme — ouvrez-en un pour l'explorer.",
      "Всё, что собирает DFSA, в одном месте. Каждый элемент — живая частица знаний Программы; откройте любой, чтобы изучить его.",
      "كل ما تجمعه DFSA في مكان واحد. كل عنصر قطعة حيّة من معارف البرنامج — افتح أيًا منها لاستكشافه.",
      "DFSA 汇聚的一切，尽在一处。每一条目都是本项目知识的鲜活组成——打开任意一项即可探索。"],
    ["All", "Todos", "Tous", "Все", "الكل", "全部"],
    ["Platform & tools", "Plataforma y herramientas", "Plateforme et outils", "Платформа и инструменты", "المنصة والأدوات", "平台与工具"],
    ["Frameworks & methods", "Marcos y métodos", "Cadres et méthodes", "Концепции и методы", "الأطر والأساليب", "框架与方法"],
    ["SLPF pillars", "Pilares del SLPF", "Piliers du SLPF", "Столпы SLPF", "ركائز SLPF", "SLPF 支柱"],
    ["Knowledge modules & methods", "Módulos y métodos de conocimiento", "Modules et méthodes de connaissances", "Модули и методы знаний", "وحدات وأساليب المعرفة", "知识模块与方法"],
    ["Knowledge & stories", "Conocimiento e historias", "Connaissances et récits", "Знания и истории", "المعرفة والقصص", "知识与故事"],
    ["Flagship", "Insignia", "Phare", "Флагман", "الرائد", "旗舰"],
    ["Live index", "Índice en vivo", "Index vivant", "Живой указатель", "فهرس حيّ", "实时索引"],

    // ---- cards: Platform & tools ----
    ["Coordination & Exchange · 3D network", "Coordinación e intercambio · red 3D", "Coordination et échange · réseau 3D", "Координация и обмен · 3D-сеть", "التنسيق والتبادل · شبكة ثلاثية الأبعاد", "协调与交流 · 三维网络"],
    ["The Constellation", "La Constelación", "La Constellation", "Созвездие", "الكوكبة", "星座"],
    ["The whole Programme as a living, interactive map — five lenses plus a Builder. The navigational backbone of DFSA.",
      "Todo el Programa como un mapa vivo e interactivo: cinco enfoques más un Constructor. La columna vertebral de navegación de DFSA.",
      "L'ensemble du Programme sous forme de carte vivante et interactive — cinq regards, un Constructeur. La colonne vertébrale de navigation de DFSA.",
      "Вся Программа в виде живой интерактивной карты — пять ракурсов плюс Конструктор. Навигационный костяк DFSA.",
      "البرنامج بأكمله بوصفه خريطة حيّة وتفاعلية — خمس عدسات إضافةً إلى أداة بناء. العمود الفقري للتنقّل في DFSA.",
      "将整个项目呈现为一张鲜活的交互地图——五个视角，外加一个构建器。这是 DFSA 的导航主干。"],
    ["Open the Constellation", "Abrir la Constelación", "Ouvrir la Constellation", "Открыть Созвездие", "افتح الكوكبة", "打开星座"],
    ["MEL · dashboard", "MEL · panel", "MEL · tableau de bord", "MEL · панель", "MEL · لوحة معلومات", "MEL · 仪表板"],
    ["Monitoring system", "Sistema de seguimiento", "Système de suivi", "Система мониторинга", "نظام الرصد", "监测系统"],
    ["The participatory M&E architecture — how results flow from communities up to GEF reporting, mirrored in a shared dashboard.",
      "La arquitectura participativa de S&E: cómo los resultados fluyen desde las comunidades hasta la presentación de informes al GEF, reflejada en un panel compartido.",
      "L'architecture participative de S&E — comment les résultats remontent des communautés jusqu'au rapportage au FEM, reflétée dans un tableau de bord partagé.",
      "Партисипативная архитектура МиО — как результаты поступают от сообществ к отчётности ГЭФ, отражаясь в общей панели.",
      "بنية الرصد والتقييم التشاركية — كيف تتدفّق النتائج من المجتمعات المحلية حتى إبلاغ مرفق البيئة العالمية، منعكسةً في لوحة معلومات مشتركة.",
      "参与式监测与评估架构——成果如何从社区上行汇入全球环境基金（GEF）报告，并映射于共享仪表板。"],
    ["Explore monitoring", "Explorar el seguimiento", "Explorer le suivi", "Изучить мониторинг", "استكشف الرصد", "探索监测"],
    ["Archive · indexing", "Archivo · indexación", "Archives · indexation", "Архив · индексация", "الأرشيف · الفهرسة", "档案 · 编目"],
    ["Archive & Index", "Archivo e índice", "Archives et index", "Архив и указатель", "الأرشيف والفهرس", "档案与索引"],
    ["The living registry of every knowledge product — searchable, indexed by pillar, type and source, and updated as new information arrives.",
      "El registro vivo de cada producto de conocimiento: con búsqueda, indexado por pilar, tipo y fuente, y actualizado a medida que llega nueva información.",
      "Le registre vivant de chaque produit de connaissances — interrogeable, indexé par pilier, type et source, et mis à jour à mesure que de nouvelles informations arrivent.",
      "Живой реестр каждого продукта знаний — с поиском, индексацией по столпу, типу и источнику, обновляемый по мере поступления новой информации.",
      "السجلّ الحيّ لكل منتج معرفي — قابل للبحث، ومفهرس حسب الركيزة والنوع والمصدر، ويُحدَّث مع ورود معلومات جديدة.",
      "每一项知识产品的鲜活登记册——可检索，按支柱、类型与来源编目，并随新信息到来而更新。"],
    ["Open the index", "Abrir el índice", "Ouvrir l'index", "Открыть указатель", "افتح الفهرس", "打开索引"],

    // ---- cards: Frameworks & methods ----
    ["Assessment method", "Método de evaluación", "Méthode d'évaluation", "Метод оценки", "أسلوب التقييم", "评估方法"],
    ["Integrated Landscape Assessment Methodology — the five-module evidence base, from remote sensing to household surveys.",
      "Metodología Integrada de Evaluación del Paisaje: la base de evidencias de cinco módulos, desde la teledetección hasta las encuestas de hogares.",
      "Méthodologie d'évaluation intégrée des paysages — la base de preuves en cinq modules, de la télédétection aux enquêtes auprès des ménages.",
      "Комплексная методология оценки ландшафта — пятимодульная база доказательств, от дистанционного зондирования до обследований домохозяйств.",
      "منهجية التقييم المتكامل للمنظر الطبيعي — قاعدة الأدلة المكوّنة من خمس وحدات، من الاستشعار عن بُعد إلى مسوح الأسر المعيشية.",
      "综合景观评估方法学——由五个模块构成的证据基础，涵盖从遥感到入户调查。"],
    ["Open framework", "Abrir el marco", "Ouvrir le cadre", "Открыть концепцию", "افتح الإطار", "打开框架"],
    ["Production framework", "Marco de producción", "Cadre de production", "Концепция производства", "إطار الإنتاج", "生产框架"],
    ["Sustainable Landscape Production Framework — the integrated Farmer Field School, seed bank and green-value-chain approach.",
      "Marco de Producción de Paisajes Sostenibles: el enfoque integrado de Escuelas de Campo para Agricultores, bancos de semillas y cadenas de valor verdes.",
      "Cadre de production de paysages durables — l'approche intégrée des Champs-écoles des producteurs, des banques de semences et des chaînes de valeur vertes.",
      "Концепция устойчивого производства ландшафтов — комплексный подход Фермерских полевых школ, семенных банков и зелёных цепочек создания стоимости.",
      "إطار الإنتاج المستدام للمناظر الطبيعية — النهج المتكامل لمدارس المزارعين الحقلية وبنوك البذور وسلاسل القيمة الخضراء.",
      "可持续景观生产框架——融合农民田间学校、种子库与绿色价值链的综合方法。"],
    ["Coordination model", "Modelo de coordinación", "Modèle de coordination", "Модель координации", "نموذج التنسيق", "协调模式"],
    ["Regional Exchange Mechanism — the bridge through which the GCP coordinates, pools expertise and docks with child projects.",
      "Mecanismo de Intercambio Regional: el puente a través del cual el GCP coordina, reúne experiencia y se conecta con los proyectos hijos.",
      "Mécanisme d'échange régional — le pont par lequel le GCP coordonne, met en commun l'expertise et s'arrime aux projets enfants.",
      "Региональный механизм обмена — мост, через который GCP координирует, объединяет экспертизу и стыкуется с дочерними проектами.",
      "آلية التبادل الإقليمي — الجسر الذي ينسّق من خلاله مشروع التنسيق العالمي (GCP) ويجمع الخبرات ويتصل بالمشاريع الفرعية.",
      "区域交流机制——全球协调项目（GCP）借以协调、汇聚专长并与子项目对接的桥梁。"],
    ["Finance · governance", "Financiación · gobernanza", "Financement · gouvernance", "Финансы · управление", "التمويل · الحوكمة", "资金 · 治理"],
    ["Financial architecture", "Arquitectura financiera", "Architecture financière", "Финансовая архитектура", "البنية المالية", "财务架构"],
    ["Finance · governance · policy tool", "Finanzas · gobernanza · herramienta de políticas", "Finance · gouvernance · outil de politique", "Финансы · управление · инструмент политики", "التمويل · الحوكمة · أداة سياساتية", "资金 · 治理 · 政策工具"],
    ["Policy Optimization Tool (PolOpT)", "Herramienta de Optimización de Políticas (PolOpT)", "Outil d'optimisation des politiques (PolOpT)", "Инструмент оптимизации политики (PolOpT)", "أداة تحسين السياسات (PolOpT)", "政策优化工具（PolOpT）"],
    ["FAO's MAFAP tool for finding the policy and spending mix that best serves economic and environmental goals — the bridge from SLPF field evidence to national drylands policy.",
      "La herramienta MAFAP de la FAO para encontrar la combinación de políticas y gasto que mejor sirve a los objetivos económicos y ambientales: el puente entre la evidencia de campo del SLPF y la política nacional sobre tierras secas.",
      "L'outil MAFAP de la FAO pour trouver la combinaison de politiques et de dépenses qui sert le mieux les objectifs économiques et environnementaux — le pont entre les preuves de terrain du SLPF et la politique nationale des terres arides.",
      "Инструмент ФАО MAFAP для поиска сочетания политики и расходов, наилучшим образом служащего экономическим и экологическим целям, — мост от полевых данных SLPF к национальной политике по засушливым землям.",
      "أداة MAFAP التابعة للفاو لإيجاد مزيج السياسات والإنفاق الأفضل خدمةً للأهداف الاقتصادية والبيئية — الجسر من الأدلة الميدانية لإطار SLPF إلى السياسة الوطنية للأراضي الجافة.",
      "粮农组织 MAFAP 工具，用于找出最能服务于经济与环境目标的政策与支出组合——架起从 SLPF 田野证据通向国家旱地政策的桥梁。"],
    ["How the Programme's funds and fee distribution are structured across the One-FAO delivery model.",
      "Cómo se estructuran los fondos y la distribución de comisiones del Programa en el modelo de ejecución One-FAO.",
      "Comment les fonds du Programme et la répartition des frais sont structurés selon le modèle de mise en œuvre One-FAO.",
      "Как структурированы средства Программы и распределение комиссий в рамках модели реализации One-FAO.",
      "كيف تُهيكَل أموال البرنامج وتوزيع الرسوم عبر نموذج التنفيذ One-FAO.",
      "本项目的资金与费用分配如何在 One-FAO 实施模式下进行架构。"],
    ["Open document", "Abrir el documento", "Ouvrir le document", "Открыть документ", "افتح المستند", "打开文件"],

    // ---- cards: SLPF pillars ----
    ["SLPF Pillar 01", "Pilar 01 del SLPF", "Pilier 01 du SLPF", "Столп SLPF 01", "ركيزة SLPF 01", "SLPF 支柱 01"],
    ["Community Seed Banks", "Bancos comunitarios de semillas", "Banques de semences communautaires", "Общинные семенные банки", "بنوك البذور المجتمعية", "社区种子库"],
    ["Crop diversification, agrobiodiversity and the genetic pool of options communities draw on to adapt and recover.",
      "Diversificación de cultivos, agrobiodiversidad y el acervo genético de opciones del que las comunidades se valen para adaptarse y recuperarse.",
      "Diversification des cultures, agrobiodiversité et réservoir génétique d'options dans lequel les communautés puisent pour s'adapter et se rétablir.",
      "Диверсификация культур, агробиоразнообразие и генетический пул вариантов, на который опираются общины, чтобы адаптироваться и восстанавливаться.",
      "تنويع المحاصيل والتنوّع البيولوجي الزراعي والمجمع الوراثي من الخيارات الذي تعتمد عليه المجتمعات للتكيّف والتعافي.",
      "作物多样化、农业生物多样性，以及社区赖以适应与复原的遗传选择库。"],
    ["SLPF Pillar 02", "Pilar 02 del SLPF", "Pilier 02 du SLPF", "Столп SLPF 02", "ركيزة SLPF 02", "SLPF 支柱 02"],
    ["Forest & Farm Facility", "Mecanismo para Bosques y Fincas", "Mécanisme forêts et fermes", "Механизм «Леса и фермы»", "مرفق الغابات والمزارع", "森林与农场基金"],
    ["Business incubation along green value chains, so sustainable landscape production pays better than degradation.",
      "Incubación de empresas a lo largo de cadenas de valor verdes, para que la producción sostenible del paisaje sea más rentable que la degradación.",
      "Incubation d'entreprises le long de chaînes de valeur vertes, pour que la production durable des paysages soit plus rentable que la dégradation.",
      "Бизнес-инкубация вдоль зелёных цепочек создания стоимости, чтобы устойчивое производство ландшафта приносило больше, чем деградация.",
      "احتضان الأعمال على امتداد سلاسل القيمة الخضراء، بحيث يصبح الإنتاج المستدام للمنظر الطبيعي أكثر ربحًا من التدهور.",
      "沿绿色价值链开展企业孵化，让可持续景观生产比土地退化更有回报。"],
    ["SLPF Pillar 03", "Pilar 03 del SLPF", "Pilier 03 du SLPF", "Столп SLPF 03", "ركيزة SLPF 03", "SLPF 支柱 03"],
    ["Farmer Field Schools", "Escuelas de campo para agricultores", "Champs-écoles des producteurs", "Фермерские полевые школы", "مدارس المزارعين الحقلية", "农民田间学校"],
    ["Experiential, farmer-to-farmer learning that transfers sustainable land and forest management on demonstration plots.",
      "Aprendizaje experiencial de agricultor a agricultor que transfiere la gestión sostenible de la tierra y los bosques en parcelas de demostración.",
      "Apprentissage expérientiel d'agriculteur à agriculteur qui transmet la gestion durable des terres et des forêts sur des parcelles de démonstration.",
      "Практическое обучение «от фермера к фермеру», передающее устойчивое управление землями и лесами на демонстрационных участках.",
      "تعلّم تجريبي من مزارع إلى مزارع ينقل الإدارة المستدامة للأراضي والغابات في قطع إيضاحية.",
      "以体验式、农民对农民的学习，在示范田块上传授可持续的土地与森林管理。"],

    // ---- cards: knowledge modules ----
    ["ILAM Mod 1 · land condition", "ILAM Mód. 1 · estado de la tierra", "ILAM Mod 1 · état des terres", "ILAM, модуль 1 · состояние земель", "ILAM الوحدة 1 · حالة الأرض", "ILAM 模块 1 · 土地状况"],
    ["Land productivity (NDVI)", "Productividad de la tierra (NDVI)", "Productivité des terres (NDVI)", "Продуктивность земель (NDVI)", "إنتاجية الأرض (NDVI)", "土地生产力（NDVI）"],
    ["Reading land productivity from satellites — the NDVI Trajectory and State indicators behind land-degradation-neutrality monitoring.",
      "Leer la productividad de la tierra desde los satélites: los indicadores de Trayectoria y Estado del NDVI tras el seguimiento de la neutralidad en la degradación de las tierras.",
      "Lire la productivité des terres depuis les satellites — les indicateurs de Trajectoire et d'État du NDVI derrière le suivi de la neutralité en matière de dégradation des terres.",
      "Считывание продуктивности земель со спутников — показатели траектории и состояния NDVI, лежащие в основе мониторинга нейтрального баланса деградации земель.",
      "قراءة إنتاجية الأرض من الأقمار الاصطناعية — مؤشّرا المسار والحالة لمؤشّر NDVI وراء رصد تحييد تدهور الأراضي.",
      "通过卫星解读土地生产力——支撑土地退化零净增长监测的 NDVI 趋势与状态指标。"],
    ["Open module", "Abrir el módulo", "Ouvrir le module", "Открыть модуль", "افتح الوحدة", "打开模块"],
    ["Fire dynamics", "Dinámica del fuego", "Dynamique du feu", "Динамика пожаров", "ديناميكيات الحرائق", "火灾动态"],
    ["A 25-year, district-level read on burned area across the Miombo–Mopane ecoregion — Trajectory and State logic applied to fire.",
      "Una lectura de 25 años a escala de distrito del área quemada en la ecorregión de Miombo–Mopane: la lógica de Trayectoria y Estado aplicada al fuego.",
      "Une lecture sur 25 ans, à l'échelle des districts, des surfaces brûlées dans l'écorégion Miombo–Mopane — la logique Trajectoire et État appliquée au feu.",
      "25-летний анализ выгоревших площадей на уровне округов в экорегионе Миомбо–Мопане — логика траектории и состояния применительно к пожарам.",
      "قراءة على مدى 25 عامًا وعلى مستوى المقاطعات للمساحات المحترقة عبر منطقة ميومبو–موباني الإيكولوجية — منطق المسار والحالة مطبَّقًا على الحرائق.",
      "对米翁博—莫帕内生态区过火面积的 25 年、区县级解读——将趋势与状态逻辑应用于火灾。"],
    ["ILAM Mod 3 · ground-truthing", "ILAM Mód. 3 · verificación sobre el terreno", "ILAM Mod 3 · vérité terrain", "ILAM, модуль 3 · наземная проверка", "ILAM الوحدة 3 · التحقّق الميداني", "ILAM 模块 3 · 地面核实"],
    ["Simplified LADA", "LADA simplificado", "LADA simplifié", "Упрощённый LADA", "LADA المبسّط", "简化版 LADA"],
    ["A fast, plot-based field assessment that anchors satellite signals to on-the-ground reality and explains the causes of degradation.",
      "Una evaluación de campo rápida basada en parcelas que ancla las señales satelitales a la realidad sobre el terreno y explica las causas de la degradación.",
      "Une évaluation de terrain rapide, basée sur des parcelles, qui ancre les signaux satellitaires à la réalité du terrain et explique les causes de la dégradation.",
      "Быстрая полевая оценка на уровне участков, привязывающая спутниковые сигналы к реальности на местах и объясняющая причины деградации.",
      "تقييم ميداني سريع قائم على القطع يربط إشارات الأقمار الاصطناعية بالواقع على الأرض ويفسّر أسباب التدهور.",
      "一种快速、以田块为单位的实地评估，将卫星信号锚定到地面实际，并解释退化的成因。"],
    ["ILAM Mod 3 · participatory", "ILAM Mód. 3 · participativo", "ILAM Mod 3 · participatif", "ILAM, модуль 3 · партисипативный", "ILAM الوحدة 3 · تشاركي", "ILAM 模块 3 · 参与式"],
    ["Stakeholder & policy", "Partes interesadas y políticas", "Parties prenantes et politiques", "Заинтересованные стороны и политика", "أصحاب المصلحة والسياسات", "利益相关方与政策"],
    ["Stakeholder analysis and policy-institutional assessment — the actors, interests and rules that decide whether interventions can work.",
      "Análisis de partes interesadas y evaluación político-institucional: los actores, intereses y reglas que deciden si las intervenciones pueden funcionar.",
      "Analyse des parties prenantes et évaluation politico-institutionnelle — les acteurs, intérêts et règles qui déterminent si les interventions peuvent fonctionner.",
      "Анализ заинтересованных сторон и политико-институциональная оценка — субъекты, интересы и правила, определяющие, сработают ли меры.",
      "تحليل أصحاب المصلحة والتقييم السياساتي المؤسسي — الفاعلون والمصالح والقواعد التي تقرّر ما إذا كانت التدخّلات قادرة على النجاح.",
      "利益相关方分析与政策—制度评估——决定干预措施能否奏效的行动者、利益与规则。"],
    ["Value chains", "Cadenas de valor", "Chaînes de valeur", "Цепочки создания стоимости", "سلاسل القيمة", "价值链"],
    ["Rapid sustainable value-chain assessment — the economic entry points that make sustainable land and forest management pay.",
      "Evaluación rápida de cadenas de valor sostenibles: los puntos de entrada económicos que hacen rentable la gestión sostenible de la tierra y los bosques.",
      "Évaluation rapide des chaînes de valeur durables — les points d'entrée économiques qui rendent rentable la gestion durable des terres et des forêts.",
      "Быстрая оценка устойчивых цепочек создания стоимости — экономические точки входа, делающие устойчивое управление землями и лесами выгодным.",
      "تقييم سريع لسلاسل القيمة المستدامة — نقاط الدخول الاقتصادية التي تجعل الإدارة المستدامة للأراضي والغابات مُجزية.",
      "可持续价值链快速评估——让可持续土地与森林管理产生收益的经济切入点。"],
    ["ILAM Mod 4 · household", "ILAM Mód. 4 · hogares", "ILAM Mod 4 · ménages", "ILAM, модуль 4 · домохозяйства", "ILAM الوحدة 4 · الأسر المعيشية", "ILAM 模块 4 · 家庭"],
    ["Household & behaviour change", "Hogares y cambio de comportamiento", "Ménages et changement de comportement", "Домохозяйства и изменение поведения", "الأسر المعيشية وتغيير السلوك", "家庭与行为改变"],
    ["SHARP+ resilience paired with the COM-B model — explaining not just whether practices are adopted, but what drives the decision.",
      "La resiliencia SHARP+ combinada con el modelo COM-B: explica no solo si se adoptan las prácticas, sino qué impulsa la decisión.",
      "La résilience SHARP+ associée au modèle COM-B — expliquant non seulement si les pratiques sont adoptées, mais ce qui motive la décision.",
      "Устойчивость SHARP+ в сочетании с моделью COM-B — объясняет не только то, принимаются ли практики, но и что движет решением.",
      "مرونة SHARP+ مقترنةً بنموذج COM-B — تفسّر لا مجرد ما إذا كانت الممارسات تُعتمَد، بل ما الذي يدفع إلى القرار.",
      "将 SHARP+ 韧性评估与 COM-B 模型结合——不仅解释做法是否被采纳，更解释驱动决策的因素。"],
    ["ILAM Mod 5 · carbon", "ILAM Mód. 5 · carbono", "ILAM Mod 5 · carbone", "ILAM, модуль 5 · углерод", "ILAM الوحدة 5 · الكربون", "ILAM 模块 5 · 碳"],
    ["Carbon balance (EX-ACT)", "Balance de carbono (EX-ACT)", "Bilan carbone (EX-ACT)", "Углеродный баланс (EX-ACT)", "الميزان الكربوني (EX-ACT)", "碳平衡（EX-ACT）"],
    ["EX-ACT and EX-ACT NEXT — FAO's carbon-balance tools, turning land-use change into a measurable global environmental benefit.",
      "EX-ACT y EX-ACT NEXT: las herramientas de balance de carbono de la FAO, que convierten el cambio de uso de la tierra en un beneficio ambiental mundial medible.",
      "EX-ACT et EX-ACT NEXT — les outils de bilan carbone de la FAO, qui transforment le changement d'usage des terres en un bénéfice environnemental mondial mesurable.",
      "EX-ACT и EX-ACT NEXT — инструменты ФАО для углеродного баланса, превращающие изменение землепользования в измеримую глобальную экологическую выгоду.",
      "EX-ACT وEX-ACT NEXT — أدوات الفاو للميزان الكربوني، التي تحوّل تغيّر استخدام الأراضي إلى منفعة بيئية عالمية قابلة للقياس.",
      "EX-ACT 与 EX-ACT NEXT——粮农组织的碳平衡工具，把土地利用变化转化为可衡量的全球环境效益。"],
    ["Strategy · scaling out", "Estrategia · expansión", "Stratégie · mise à l'échelle", "Стратегия · масштабирование", "الاستراتيجية · التوسّع", "战略 · 推广扩展"],
    ["SLM scaling strategy", "Estrategia de expansión de la GST", "Stratégie de mise à l'échelle de la GDT", "Стратегия масштабирования УУЗ", "استراتيجية توسيع الإدارة المستدامة للأراضي", "可持续土地管理推广战略"],
    ["A strategy for scaling sustainable land management among smallholders — from what works to what spreads, built on a household baseline.",
      "Una estrategia para ampliar la gestión sostenible de la tierra entre los pequeños productores: de lo que funciona a lo que se difunde, sobre una línea de base de hogares.",
      "Une stratégie pour mettre à l'échelle la gestion durable des terres chez les petits exploitants — de ce qui marche à ce qui se diffuse, fondée sur une référence au niveau des ménages.",
      "Стратегия масштабирования устойчивого управления землями среди мелких землевладельцев — от того, что работает, к тому, что распространяется, на основе базового уровня домохозяйств.",
      "استراتيجية لتوسيع الإدارة المستدامة للأراضي بين صغار الحائزين — من ما ينجح إلى ما ينتشر، مبنيةً على خط أساس على مستوى الأسر المعيشية.",
      "面向小农户推广可持续土地管理的战略——以家庭基线为依托，从「行之有效」走向「广为传播」。"],
    ["Method · social network analysis", "Método · análisis de redes sociales", "Méthode · analyse des réseaux sociaux", "Метод · анализ социальных сетей", "أسلوب · تحليل الشبكات الاجتماعية", "方法 · 社会网络分析"],
    ["Knowledge-flow network analysis", "Análisis de redes de flujo de conocimiento", "Analyse du réseau de flux de connaissances", "Анализ сети потоков знаний", "تحليل شبكة تدفّق المعرفة", "知识流动网络分析"],
    ["A social network analysis of two Botswana producer organizations — who shares SLM knowledge with whom, the real influencers, and where the bottlenecks lie.",
      "Un análisis de redes sociales de dos organizaciones de productores de Botswana: quién comparte conocimientos de GST con quién, los verdaderos influyentes y dónde están los cuellos de botella.",
      "Une analyse des réseaux sociaux de deux organisations de producteurs du Botswana — qui partage le savoir en GDT avec qui, les véritables influenceurs et où se situent les goulets d'étranglement.",
      "Анализ социальных сетей двух организаций производителей Ботсваны — кто с кем делится знаниями УУЗ, кто реальные лидеры мнений и где находятся узкие места.",
      "تحليل للشبكات الاجتماعية لمنظمتين من منظمات المنتِجين في بوتسوانا — مَن يتبادل معارف الإدارة المستدامة للأراضي مع مَن، ومَن المؤثّرون الحقيقيون، وأين تكمن الاختناقات.",
      "对博茨瓦纳两个生产者组织的社会网络分析——谁与谁分享可持续土地管理知识、真正的影响者是谁、瓶颈何在。"],
    ["Open the analysis", "Abrir el análisis", "Ouvrir l'analyse", "Открыть анализ", "افتح التحليل", "打开分析"],

    // ---- cards: knowledge & stories ----
    ["Field story · gender", "Historia de campo · género", "Récit de terrain · genre", "История с мест · гендер", "قصة ميدانية · النوع الاجتماعي", "田野故事 · 性别"],
    ["When Women Lead", "Cuando las mujeres lideran", "Quand les femmes dirigent", "Когда женщины ведут", "عندما تقود المرأة", "当女性引领时"],
    ["How women's leadership and the land's recovery move together — a story from the Programme's gender stream.",
      "Cómo el liderazgo de las mujeres y la recuperación de la tierra avanzan juntos: una historia de la línea de género del Programa.",
      "Comment le leadership des femmes et le rétablissement des terres progressent ensemble — un récit issu du volet genre du Programme.",
      "Как лидерство женщин и восстановление земли движутся вместе — история из гендерного направления Программы.",
      "كيف تسير قيادة المرأة وتعافي الأرض جنبًا إلى جنب — قصة من مسار النوع الاجتماعي في البرنامج.",
      "女性领导力与土地复原如何携手并进——来自本项目性别工作线的故事。"],
    ["Read the story", "Leer la historia", "Lire le récit", "Читать историю", "اقرأ القصة", "阅读故事"],
    ["Policy · gender", "Política · género", "Politique · genre", "Политика · гендер", "السياسات · النوع الاجتماعي", "政策 · 性别"],
    ["Global Gender Action Plan", "Plan de Acción Mundial de Género", "Plan d'action mondial pour le genre", "Глобальный план действий по гендерным вопросам", "خطة العمل العالمية للنوع الاجتماعي", "全球性别行动计划"],
    ["The Programme's gender-responsiveness commitments and the actions that put women's empowerment at the centre.",
      "Los compromisos de sensibilidad de género del Programa y las acciones que sitúan el empoderamiento de las mujeres en el centro.",
      "Les engagements du Programme en matière de prise en compte du genre et les actions qui placent l'autonomisation des femmes au centre.",
      "Обязательства Программы по учёту гендерных аспектов и действия, ставящие расширение прав и возможностей женщин в центр.",
      "التزامات البرنامج بالاستجابة للنوع الاجتماعي والإجراءات التي تضع تمكين المرأة في الصميم.",
      "本项目在性别敏感方面的承诺，以及把赋权女性置于核心的各项行动。"],
    ["Open the plan", "Abrir el plan", "Ouvrir le plan", "Открыть план", "افتح الخطة", "打开计划"],
    ["Case · Malawi", "Caso · Malawi", "Étude de cas · Malawi", "Кейс · Малави", "دراسة حالة · ملاوي", "案例 · 马拉维"],
    ["Sisteminha · IFES Malawi", "Sisteminha · IFES Malawi", "Sisteminha · IFES Malawi", "Sisteminha · IFES Малави", "Sisteminha · IFES ملاوي", "Sisteminha · IFES 马拉维"],
    ["Integrated Food and Energy Systems in practice — Malawi's champion core theme, from pigeon-pea to fuelwood.",
      "Sistemas Integrados de Alimentos y Energía en la práctica: el tema central destacado de Malawi, del guandú a la leña.",
      "Les systèmes intégrés alimentation-énergie en pratique — le thème central phare du Malawi, du pois d'Angole au bois de feu.",
      "Интегрированные продовольственно-энергетические системы на практике — ведущая ключевая тема Малави, от голубиного гороха до топливной древесины.",
      "النظم المتكاملة للغذاء والطاقة في الممارسة العملية — الموضوع المحوري الرائد لملاوي، من البازلاء الحمامية إلى حطب الوقود.",
      "食能一体化系统的实践——马拉维的标志性核心主题，从木豆到薪柴。"],
    ["Open the case", "Abrir el caso", "Ouvrir l'étude de cas", "Открыть кейс", "افتح دراسة الحالة", "打开案例"],
    ["Campaign · drylands", "Campaña · tierras secas", "Campagne · terres arides", "Кампания · засушливые земли", "حملة · الأراضي الجافة", "倡导活动 · 旱地"],
    ["DFSM Campaign", "Campaña DFSM", "Campagne DFSM", "Кампания DFSM", "حملة DFSM", "DFSM 倡导活动"],
    ["Dryland Forest & Sustainable Management — the Programme's outward-facing campaign and its core messages.",
      "Bosques de Tierras Secas y Gestión Sostenible: la campaña de cara al público del Programa y sus mensajes centrales.",
      "Forêts des terres arides et gestion durable — la campagne publique du Programme et ses messages clés.",
      "Леса засушливых земель и устойчивое управление — публичная кампания Программы и её ключевые послания.",
      "غابات الأراضي الجافة والإدارة المستدامة — حملة البرنامج الموجَّهة للجمهور ورسائلها الأساسية.",
      "旱地森林与可持续管理——本项目面向公众的倡导活动及其核心信息。"],
    ["Open the campaign", "Abrir la campaña", "Ouvrir la campagne", "Открыть кампанию", "افتح الحملة", "打开活动"],

    // ===== 04 wiring =====
    ["Leveraging the DSL-IP knowledge structure",
      "Aprovechar la estructura de conocimiento del DSL-IP",
      "Tirer parti de la structure de connaissances du DSL-IP",
      "Использование структуры знаний DSL-IP",
      "الاستفادة من هيكل المعرفة في DSL-IP",
      "善用 DSL-IP 的知识架构"],
    ["DFSA does not start from scratch. It plugs into machinery the Programme has already built.",
      "DFSA no parte de cero. Se conecta a una maquinaria que el Programa ya ha construido.",
      "DFSA ne part pas de zéro. Elle se branche sur une mécanique que le Programme a déjà bâtie.",
      "DFSA не начинает с нуля. Она подключается к механизму, который Программа уже построила.",
      "لا تبدأ DFSA من الصفر. فهي تتصل بآلية بناها البرنامج بالفعل.",
      "DFSA 并非从零起步。它接入了本项目早已搭建的机制。"],
    ["The Global Coordination Project already runs a knowledge-management structure — the Regional Exchange Mechanism, the Communities of Practice, the MEL working group and a participatory dashboard. DFSA becomes the public face and durable memory of that structure: the place its outputs are gathered, connected and kept discoverable long after a given meeting or report.",
      "El Proyecto de Coordinación Mundial ya gestiona una estructura de gestión del conocimiento: el Mecanismo de Intercambio Regional, las Comunidades de Práctica, el grupo de trabajo de MEL y un panel participativo. DFSA se convierte en el rostro público y la memoria duradera de esa estructura: el lugar donde sus productos se reúnen, conectan y siguen siendo localizables mucho después de una reunión o un informe.",
      "Le Projet de coordination mondiale gère déjà une structure de gestion des connaissances — le Mécanisme d'échange régional, les Communautés de pratique, le groupe de travail S&E-A et un tableau de bord participatif. DFSA devient le visage public et la mémoire durable de cette structure : le lieu où ses produits sont rassemblés, reliés et maintenus repérables bien après une réunion ou un rapport.",
      "Проект глобальной координации уже управляет структурой управления знаниями — Региональным механизмом обмена, Сообществами практики, рабочей группой MEL и партисипативной панелью. DFSA становится публичным лицом и долговременной памятью этой структуры: местом, где её результаты собираются, связываются и остаются доступными для поиска ещё долго после конкретной встречи или отчёта.",
      "يدير مشروع التنسيق العالمي بالفعل هيكلاً لإدارة المعارف — آلية التبادل الإقليمي، وجماعات الممارسة، وفريق عمل الرصد والتقييم والتعلّم، ولوحة معلومات تشاركية. وتصبح DFSA الوجه العام والذاكرة الدائمة لذلك الهيكل: المكان الذي تُجمَع فيه مخرجاته وتُربَط وتبقى قابلة للاكتشاف بعد وقت طويل من أي اجتماع أو تقرير.",
      "全球协调项目早已运行着一套知识管理架构——区域交流机制、实践社区、监测评估学习（MEL）工作组以及一个参与式仪表板。DFSA 成为该架构对外的面孔与持久的记忆：在某次会议或报告之后很久，其成果仍在此处被汇集、连接并保持可被发现。"],
    ["The Constellation is the connective tissue — every framework, country and partner is already a node, so adding a new knowledge product to DFSA is simply lighting up where it belongs in the network.",
      "La Constelación es el tejido conectivo: cada marco, país y socio ya es un nodo, de modo que añadir un nuevo producto de conocimiento a DFSA es simplemente iluminar el lugar que le corresponde en la red.",
      "La Constellation est le tissu conjonctif — chaque cadre, pays et partenaire est déjà un nœud, de sorte qu'ajouter un nouveau produit de connaissances à DFSA revient simplement à allumer la place qui lui revient dans le réseau.",
      "Созвездие — это соединительная ткань: каждая концепция, страна и партнёр уже являются узлом, поэтому добавление нового продукта знаний в DFSA — это просто подсветка того места, где ему положено быть в сети.",
      "الكوكبة هي النسيج الرابط — فكل إطار وبلد وشريك هو عقدة بالفعل، لذا فإن إضافة منتج معرفي جديد إلى DFSA لا تعدو إضاءة الموضع الذي ينتمي إليه في الشبكة.",
      "「星座」是连接的纽带——每一个框架、国家与伙伴都已是一个节点，因此向 DFSA 添加一项新的知识产品，不过是点亮它在网络中应有的位置。"],
    ["Channelled through the REM", "Canalizado a través del REM", "Acheminé via le REM", "Проводится через REM", "موجَّه عبر آلية التبادل الإقليمي (REM)", "经由 REM 汇入"],
    ["Regional exchange feeds country knowledge in; DFSA keeps it findable.",
      "El intercambio regional aporta el conocimiento de los países; DFSA lo mantiene localizable.",
      "L'échange régional fait remonter le savoir des pays ; DFSA le garde repérable.",
      "Региональный обмен подаёт знания стран; DFSA делает их находимыми.",
      "يغذّي التبادل الإقليمي معارف البلدان؛ وتبقيها DFSA قابلة للعثور عليها.",
      "区域交流将各国知识汇入；DFSA 让其保持可被检索。"],
    ["Curated by the Communities of Practice", "Curado por las Comunidades de Práctica", "Géré par les Communautés de pratique", "Курируется Сообществами практики", "تنسّقها جماعات الممارسة", "由实践社区策展"],
    ["LDN, SLM/SFM and Gender CoPs supply and quality-check the content.",
      "Las CoP de NDT, GST/GFS y Género aportan y verifican la calidad del contenido.",
      "Les CdP NDT, GDT/GDF et Genre fournissent le contenu et en vérifient la qualité.",
      "Сообщества практики по НБДЗ, УУЗ/УЛП и гендеру поставляют контент и проверяют его качество.",
      "تتولّى جماعات الممارسة المعنية بتحييد تدهور الأراضي والإدارة المستدامة للأراضي/الغابات والنوع الاجتماعي توفير المحتوى والتحقّق من جودته.",
      "土地退化零净增长、可持续土地/森林管理与性别等实践社区提供内容并把关质量。"],
    ["Evidenced by MEL", "Evidenciado por MEL", "Étayé par le S&E-A", "Подтверждается MEL", "مدعوم بأدلة الرصد والتقييم والتعلّم (MEL)", "由 MEL 提供佐证"],
    ["The monitoring system and dashboard keep every claim sourced and current.",
      "El sistema de seguimiento y el panel mantienen cada afirmación con su fuente y actualizada.",
      "Le système de suivi et le tableau de bord maintiennent chaque affirmation sourcée et à jour.",
      "Система мониторинга и панель поддерживают каждое утверждение подкреплённым источником и актуальным.",
      "يُبقي نظام الرصد ولوحة المعلومات كل ادعاء موثّق المصدر ومُحدَّثًا.",
      "监测系统与仪表板让每一项论断都有出处并保持最新。"],
    ["Mapped on the Constellation", "Cartografiado en la Constelación", "Cartographié sur la Constellation", "Отображается на Созвездии", "مرسوم على الكوكبة", "映射于星座之上"],
    ["Each product takes its place as a node in the living network.",
      "Cada producto ocupa su lugar como un nodo en la red viva.",
      "Chaque produit prend sa place comme nœud dans le réseau vivant.",
      "Каждый продукт занимает своё место как узел в живой сети.",
      "يأخذ كل منتج مكانه بوصفه عقدة في الشبكة الحيّة.",
      "每一项产品都作为节点融入这张鲜活的网络。"],

    // ===== 06 transparency =====
    ["Transparency & data policy", "Transparencia y política de datos", "Transparence et politique des données", "Прозрачность и политика данных", "الشفافية وسياسة البيانات", "透明度与数据政策"],
    ["DFSA is built to be open about what it holds, where it comes from, and how it is handled. Everything mapped here is drawn from publicly available sources and is reviewable.",
      "DFSA está concebida para ser transparente sobre lo que contiene, de dónde procede y cómo se gestiona. Todo lo aquí cartografiado procede de fuentes de acceso público y es revisable.",
      "DFSA est conçue pour être transparente sur ce qu'elle contient, d'où cela provient et comment c'est traité. Tout ce qui est cartographié ici provient de sources accessibles au public et est vérifiable.",
      "DFSA создана быть открытой в отношении того, что в ней содержится, откуда это берётся и как обрабатывается. Всё, что здесь отображено, взято из общедоступных источников и поддаётся проверке.",
      "صُمِّمت DFSA لتكون منفتحة بشأن ما تحتويه ومن أين يأتي وكيف يُعالَج. وكل ما هو مرسوم هنا مستمدّ من مصادر متاحة للعموم وقابل للمراجعة.",
      "DFSA 的设计旨在对其所含内容、来源及处理方式保持公开。此处映射的一切均取自公开来源，且可供查证。"],
    ["Publicly sourced", "De fuentes públicas", "De sources publiques", "Из открытых источников", "مصدرها عام", "源自公开来源"],
    ["All information is compiled from publicly available programme documents, reports and references. DFSA does not publish confidential or personal data.",
      "Toda la información se recopila a partir de documentos, informes y referencias del Programa de acceso público. DFSA no publica datos confidenciales ni personales.",
      "Toutes les informations sont compilées à partir de documents, rapports et références du Programme accessibles au public. DFSA ne publie pas de données confidentielles ou personnelles.",
      "Вся информация собрана из общедоступных программных документов, отчётов и справочных материалов. DFSA не публикует конфиденциальные или персональные данные.",
      "تُجمَع كل المعلومات من وثائق البرنامج وتقاريره ومراجعه المتاحة للعموم. ولا تنشر DFSA بيانات سرّية أو شخصية.",
      "所有信息均汇编自公开可得的项目文件、报告与参考资料。DFSA 不发布机密或个人数据。"],
    ["Validation status", "Estado de validación", "Statut de validation", "Статус проверки", "حالة التحقّق", "验证状态"],
    ["Nodes shown in white are newly added and awaiting validation. Status is visible throughout, so nothing unverified is presented as settled fact.",
      "Los nodos mostrados en blanco son de adición reciente y están a la espera de validación. El estado es visible en todo momento, de modo que nada sin verificar se presenta como hecho establecido.",
      "Les nœuds affichés en blanc sont nouvellement ajoutés et en attente de validation. Le statut est visible partout, de sorte que rien de non vérifié n'est présenté comme un fait acquis.",
      "Узлы, показанные белым, недавно добавлены и ожидают проверки. Статус виден повсюду, поэтому ничто непроверенное не выдаётся за установленный факт.",
      "العُقد المعروضة باللون الأبيض مضافة حديثًا وتنتظر التحقّق. والحالة ظاهرة في كل مكان، بحيث لا يُقدَّم أي أمر غير مُتحقَّق منه بوصفه حقيقة مستقرّة.",
      "以白色显示的节点为新近添加、尚待验证。状态全程可见，因此任何未经核实的内容都不会被当作既定事实呈现。"],
    ["Use of AI", "Uso de la IA", "Recours à l'IA", "Использование ИИ", "استخدام الذكاء الاصطناعي", "人工智能的使用"],
    ["AI assists in structuring and mapping the material; the platform is actively overseen by a UN Officer, and outputs relate to the Programme's behaviour-change research.",
      "La IA ayuda a estructurar y cartografiar el material; la plataforma está supervisada activamente por un funcionario de la ONU, y los resultados se relacionan con la investigación del Programa sobre el cambio de comportamiento.",
      "L'IA aide à structurer et à cartographier le contenu ; la plateforme est activement supervisée par un fonctionnaire de l'ONU, et les résultats se rapportent à la recherche du Programme sur le changement de comportement.",
      "ИИ помогает структурировать и картировать материал; платформа находится под активным надзором сотрудника ООН, а результаты связаны с исследованием Программы по изменению поведения.",
      "يساعد الذكاء الاصطناعي في هيكلة المواد ورسم خرائطها؛ ويشرف على المنصة بنشاط موظف في الأمم المتحدة، وتتّصل المخرجات ببحوث البرنامج المتعلّقة بتغيير السلوك.",
      "人工智能协助对材料进行结构化与映射；平台由一名联合国官员积极监督，相关产出与本项目的行为改变研究有关。"],
    ["Your data & removal", "Tus datos y su eliminación", "Vos données et leur suppression", "Ваши данные и их удаление", "بياناتك وحذفها", "您的数据与删除"],
    ["If any item should be corrected or removed, a grievance mechanism is available — requests are reviewed and actioned promptly.",
      "Si algún elemento debe corregirse o eliminarse, se dispone de un mecanismo de quejas: las solicitudes se revisan y atienden con prontitud.",
      "Si un élément doit être corrigé ou supprimé, un mécanisme de réclamation est disponible — les demandes sont examinées et traitées rapidement.",
      "Если какой-либо элемент следует исправить или удалить, доступен механизм рассмотрения жалоб — запросы рассматриваются и обрабатываются оперативно.",
      "إذا تعيّن تصحيح أي عنصر أو إزالته، تتوفّر آلية للتظلّم — وتُراجَع الطلبات ويُتّخذ إجراء بشأنها فورًا.",
      "如有任何条目需更正或删除，可使用申诉机制——请求将得到及时审核与处理。"],
    ["Request a correction or removal →", "Solicitar una corrección o eliminación →", "Demander une correction ou une suppression →", "Запросить исправление или удаление →", "اطلب تصحيحًا أو إزالة →", "申请更正或删除 →"],

    // ===== 07 partner =====
    ["Become a partner", "Conviértase en socio", "Devenir partenaire", "Стать партнёром", "كن شريكًا", "成为合作伙伴"],
    ["Help keep dryland knowledge alive", "Ayude a mantener vivo el conocimiento sobre las tierras secas", "Aidez à garder vivant le savoir sur les terres arides", "Помогите сохранить знания о засушливых землях живыми", "ساعد في إبقاء معارف الأراضي الجافة حيّة", "助力让旱地知识保持鲜活"],
    ["DFSA grows with its network. Institutions, researchers and country teams are invited to contribute knowledge, share reference material, or connect an exchange or knowledge hub — every contribution is catalogued, attributed and kept current in the living archive.",
      "DFSA crece con su red. Se invita a instituciones, investigadores y equipos de país a aportar conocimiento, compartir material de referencia o conectar un intercambio o un centro de conocimiento; cada contribución se cataloga, se atribuye y se mantiene actualizada en el archivo vivo.",
      "DFSA grandit avec son réseau. Les institutions, chercheurs et équipes pays sont invités à apporter des connaissances, partager des documents de référence ou connecter un échange ou un pôle de connaissances — chaque contribution est cataloguée, attribuée et tenue à jour dans les archives vivantes.",
      "DFSA растёт вместе со своей сетью. Учреждения, исследователи и страновые команды приглашаются вносить знания, делиться справочными материалами или подключать механизм обмена либо узел знаний — каждый вклад каталогизируется, атрибутируется и поддерживается в актуальном состоянии в живом архиве.",
      "تنمو DFSA مع شبكتها. والمؤسسات والباحثون والفرق القُطرية مدعوّون للإسهام بالمعرفة أو تبادل المواد المرجعية أو ربط آلية تبادل أو مركز معرفة — وتُفهرَس كل مساهمة وتُنسَب وتبقى محدَّثة في الأرشيف الحيّ.",
      "DFSA 随其网络共同成长。诚邀各机构、研究者与国家团队贡献知识、分享参考资料，或接入某一交流机制或知识枢纽——每一项贡献都会在鲜活的档案中被编目、署名并保持更新。"],
    ["Institutions & partners", "Instituciones y socios", "Institutions et partenaires", "Учреждения и партнёры", "المؤسسات والشركاء", "机构与伙伴"],
    ["Connect your programme, dataset or platform into the constellation as a recognised node.",
      "Conecte su programa, conjunto de datos o plataforma a la constelación como un nodo reconocido.",
      "Connectez votre programme, jeu de données ou plateforme à la constellation comme un nœud reconnu.",
      "Подключите свою программу, набор данных или платформу к созвездию в качестве признанного узла.",
      "اربط برنامجك أو مجموعة بياناتك أو منصتك بالكوكبة بوصفها عقدة معترفًا بها.",
      "将您的项目、数据集或平台作为公认节点接入星座。"],
    ["Researchers", "Investigadores", "Chercheurs", "Исследователи", "الباحثون", "研究者"],
    ["Share frameworks, findings and field evidence on managing dryland forests as complex systems.",
      "Comparta marcos, hallazgos y evidencia de campo sobre la gestión de los bosques de tierras secas como sistemas complejos.",
      "Partagez des cadres, des résultats et des preuves de terrain sur la gestion des forêts des terres arides comme systèmes complexes.",
      "Делитесь концепциями, выводами и полевыми данными об управлении лесами засушливых земель как сложными системами.",
      "شارك الأطر والنتائج والأدلة الميدانية حول إدارة غابات الأراضي الجافة بوصفها نظمًا معقّدة.",
      "分享将旱地森林作为复杂系统加以管理的框架、发现与田野证据。"],
    ["Country teams & hubs", "Equipos de país y centros", "Équipes pays et pôles", "Страновые команды и узлы", "الفرق القُطرية والمراكز", "国家团队与枢纽"],
    ["Dock a Regional Exchange or knowledge hub so its products flow into the archive automatically.",
      "Acople un Intercambio Regional o centro de conocimiento para que sus productos fluyan automáticamente al archivo.",
      "Arrimez un échange régional ou un pôle de connaissances pour que ses produits alimentent automatiquement les archives.",
      "Состыкуйте региональный механизм обмена или узел знаний, чтобы его продукты автоматически поступали в архив.",
      "اربط آلية تبادل إقليمي أو مركز معرفة بحيث تتدفّق منتجاته إلى الأرشيف تلقائيًا.",
      "对接某一区域交流机制或知识枢纽，使其产品自动汇入档案。"],
    ["Propose a contribution →", "Proponer una contribución →", "Proposer une contribution →", "Предложить вклад →", "اقترح مساهمة →", "提出贡献 →"],
    ["See how the archive works", "Vea cómo funciona el archivo", "Voir comment fonctionnent les archives", "Узнать, как работает архив", "اطّلع على كيفية عمل الأرشيف", "了解档案如何运作"],

    // ===== rail =====
    ["Spotlight", "Destacado", "À la une", "В центре внимания", "تسليط الضوء", "焦点"],
    ["A Call to Action on Drylands", "Un llamado a la acción sobre las tierras secas", "Un appel à l'action pour les terres arides", "Призыв к действию по засушливым землям", "نداء إلى العمل بشأن الأراضي الجافة", "关于旱地的行动呼吁"],
    ["Drylands hold a quarter of the world's forests and sustain over two billion people — yet face mounting degradation. Join the call to protect and restore them.",
      "Las tierras secas albergan una cuarta parte de los bosques del mundo y sustentan a más de dos mil millones de personas, pero enfrentan una degradación creciente. Únase al llamado a protegerlas y restaurarlas.",
      "Les terres arides abritent un quart des forêts du monde et font vivre plus de deux milliards de personnes — mais subissent une dégradation croissante. Joignez-vous à l'appel pour les protéger et les restaurer.",
      "На засушливые земли приходится четверть мировых лесов, и они поддерживают более двух миллиардов человек, но сталкиваются с растущей деградацией. Присоединяйтесь к призыву защитить и восстановить их.",
      "تضمّ الأراضي الجافة رُبع غابات العالم وتعيل أكثر من ملياري إنسان — لكنها تواجه تدهورًا متزايدًا. انضمّ إلى النداء لحمايتها واستصلاحها.",
      "旱地拥有全球四分之一的森林，养育着二十多亿人口——却面临日益加剧的退化。加入呼吁，共同保护并恢复旱地。"],
    ["Read the call", "Leer el llamado", "Lire l'appel", "Читать призыв", "اقرأ النداء", "阅读呼吁"],
    ["Coming soon at UNCCD COP 17.", "Próximamente en la COP 17 de la CNULD.", "Bientôt à la COP 17 de la CNULCD.", "Скоро на КС-17 КБОООН.", "قريبًا في الدورة 17 لمؤتمر الأطراف في اتفاقية مكافحة التصحّر (UNCCD COP 17).", "即将亮相《联合国防治荒漠化公约》第十七次缔约方大会（UNCCD COP 17）。"],
    ["Latest news", "Últimas noticias", "Dernières actualités", "Последние новости", "آخر الأخبار", "最新动态"],
    ["Private sector expo unlocks investment for climate-resilient landscapes",
      "Una feria del sector privado desbloquea inversión para paisajes resilientes al clima",
      "Un salon du secteur privé débloque des investissements pour des paysages résilients au climat",
      "Выставка частного сектора открывает инвестиции в климатоустойчивые ландшафты",
      "معرض للقطاع الخاص يفتح آفاق الاستثمار في مناظر طبيعية قادرة على الصمود مناخيًا",
      "私营部门博览会为气候韧性景观释放投资"],
    ["DSL-IP data accelerates forest restoration in Malawi",
      "Los datos del DSL-IP aceleran la restauración forestal en Malawi",
      "Les données du DSL-IP accélèrent la restauration des forêts au Malawi",
      "Данные DSL-IP ускоряют восстановление лесов в Малави",
      "بيانات DSL-IP تسرّع استعادة الغابات في ملاوي",
      "DSL-IP 数据加速马拉维森林恢复"],
    ["Botswana uses Earth Map to track burned areas",
      "Botswana usa Earth Map para hacer seguimiento de las áreas quemadas",
      "Le Botswana utilise Earth Map pour suivre les surfaces brûlées",
      "Ботсвана использует Earth Map для отслеживания выгоревших площадей",
      "بوتسوانا تستخدم Earth Map لتتبّع المساحات المحترقة",
      "博茨瓦纳使用 Earth Map 追踪过火区域"],
    ["All news on FAO.org", "Todas las noticias en FAO.org", "Toutes les actualités sur FAO.org", "Все новости на FAO.org", "كل الأخبار على FAO.org", "FAO.org 上的全部动态"],
    ["Useful links", "Enlaces útiles", "Liens utiles", "Полезные ссылки", "روابط مفيدة", "实用链接"],
    ["Platform map", "Mapa de la plataforma", "Carte de la plateforme", "Карта платформы", "خريطة المنصة", "平台地图"],
    ["Every page as a network", "Cada página como una red", "Chaque page comme un réseau", "Каждая страница как сеть", "كل صفحة بوصفها شبكة", "将每个页面化为网络"],
    ["Archive & Index", "Archivo e índice", "Archives et index", "Архив и указатель", "الأرشيف والفهرس", "档案与索引"],
    ["The living registry", "El registro vivo", "Le registre vivant", "Живой реестр", "السجلّ الحيّ", "鲜活的登记册"],
    ["Constellation tool", "Herramienta Constelación", "Outil Constellation", "Инструмент «Созвездие»", "أداة الكوكبة", "星座工具"],
    ["Interactive 3D network", "Red 3D interactiva", "Réseau 3D interactif", "Интерактивная 3D-сеть", "شبكة تفاعلية ثلاثية الأبعاد", "交互式三维网络"],
    ["Newsletter", "Boletín", "Bulletin", "Рассылка", "النشرة الإخبارية", "通讯"],
    ["Read & subscribe", "Leer y suscribirse", "Lire et s'abonner", "Читать и подписаться", "اقرأ واشترك", "阅读并订阅"],
    ["MEL dashboard", "Panel de MEL", "Tableau de bord S&E-A", "Панель MEL", "لوحة معلومات MEL", "MEL 仪表板"],
    ["Live monitoring & evaluation", "Seguimiento y evaluación en vivo", "Suivi et évaluation en direct", "Мониторинг и оценка в реальном времени", "رصد وتقييم مباشر", "实时监测与评估"],
    ["Become a partner", "Conviértase en socio", "Devenir partenaire", "Стать партнёром", "كن شريكًا", "成为合作伙伴"],
    ["Contribute knowledge, share reference material, or dock an exchange into the living archive.",
      "Aporte conocimiento, comparta material de referencia o conecte un intercambio al archivo vivo.",
      "Apportez des connaissances, partagez du matériel de référence ou connectez un échange aux archives vivantes.",
      "Делитесь знаниями, справочными материалами или подключите обмен к живому архиву.",
      "ساهم بالمعرفة، أو شارك مواد مرجعية، أو اربط آلية تبادل بالأرشيف الحيّ.",
      "贡献知识、分享参考资料，或将交流机制接入鲜活档案。"],
    ["Get involved", "Participar", "Participer", "Принять участие", "شارك", "参与其中"],

    // ===== footer =====
    ["Disclaimer", "Aviso legal", "Avertissement", "Оговорка", "إخلاء مسؤولية", "免责声明"],
    ["DFSA is a platform developed by the Drylands Sustainable Landscapes Impact Program. It is funded by the GEF (Global Environment Facility) and its exit upkeep is linked to the DFSA (Dryland Forests Support Accelerator). DFSA is currently under development and evolving, therefore content and features may change.",
      "DFSA es una plataforma desarrollada por el Programa de Impacto de Paisajes Sostenibles de Tierras Secas. Está financiada por el GEF (Fondo para el Medio Ambiente Mundial) y su mantenimiento a la salida está vinculado al DFSA (Acelerador de Apoyo a los Bosques de Tierras Secas). DFSA se encuentra actualmente en desarrollo y evolución, por lo que su contenido y funciones pueden cambiar.",
      "DFSA est une plateforme développée par le Programme d'impact pour des paysages durables en terres arides. Elle est financée par le FEM (Fonds pour l'environnement mondial) et son entretien de sortie est lié au DFSA (Accélérateur de soutien aux forêts des terres arides). DFSA est actuellement en cours de développement et d'évolution ; son contenu et ses fonctionnalités peuvent donc changer.",
      "DFSA — это платформа, разработанная Программой устойчивых ландшафтов засушливых земель. Она финансируется ГЭФ (Глобальным экологическим фондом), а её эксплуатация на этапе выхода связана с DFSA (Акселератором поддержки лесов засушливых земель). DFSA в настоящее время находится в стадии разработки и развития, поэтому её содержание и функции могут меняться.",
      "إنّ DFSA منصة طوّرها برنامج الأثر للمناظر الطبيعية المستدامة للأراضي الجافة. وهي مموَّلة من مرفق البيئة العالمية (GEF)، وترتبط صيانتها بعد انتهاء المشروع بمسرّع دعم غابات الأراضي الجافة (DFSA). ولا تزال DFSA قيد التطوير والتطوّر، ولذلك قد يتغيّر محتواها وميزاتها.",
      "DFSA 是由旱地可持续景观影响计划开发的平台。它由全球环境基金（GEF）资助，其退出阶段的维护与旱地森林支持加速器（DFSA）相关联。DFSA 目前仍在开发与演进中，因此其内容与功能可能会发生变化。"],
    ["Grievance & data removal", "Quejas y eliminación de datos", "Réclamations et suppression de données", "Жалобы и удаление данных", "التظلّم وحذف البيانات", "申诉与数据删除"],
    ["If any information displayed should be corrected or removed, a grievance mechanism is available. Submit a request and the relevant item will be reviewed and, where warranted, amended or taken down promptly.",
      "Si alguna información mostrada debe corregirse o eliminarse, se dispone de un mecanismo de quejas. Envíe una solicitud y el elemento correspondiente se revisará y, cuando proceda, se modificará o retirará con prontitud.",
      "Si une information affichée doit être corrigée ou supprimée, un mécanisme de réclamation est disponible. Soumettez une demande et l'élément concerné sera examiné et, le cas échéant, modifié ou retiré rapidement.",
      "Если какая-либо отображаемая информация должна быть исправлена или удалена, доступен механизм рассмотрения жалоб. Подайте запрос, и соответствующий элемент будет рассмотрен и, при необходимости, оперативно изменён или удалён.",
      "إذا تعيّن تصحيح أي معلومات معروضة أو إزالتها، تتوفّر آلية للتظلّم. قدِّم طلبًا وسيُراجَع العنصر المعني، وعند الاقتضاء يُعدَّل أو يُزال فورًا.",
      "如所显示的任何信息需更正或删除，可使用申诉机制。提交请求后，相关条目将得到审核，并在适当情况下及时修订或撤下。"],
    ["Replace the address above with your monitored contact before publishing.",
      "Sustituya la dirección anterior por su contacto supervisado antes de publicar.",
      "Remplacez l'adresse ci-dessus par votre contact surveillé avant la publication.",
      "Перед публикацией замените указанный выше адрес на контролируемый вами контакт.",
      "استبدل العنوان أعلاه بجهة اتصال خاضعة لمتابعتك قبل النشر.",
      "发布前，请将上方地址替换为您所监控的联系方式。"],
    ["Funded by the GEF", "Financiado por el GEF", "Financé par le FEM", "Финансируется ГЭФ", "بتمويل من مرفق البيئة العالمية (GEF)", "由全球环境基金（GEF）资助"],
    ["Led by FAO Drylands Programme", "Dirigido por el Programa de Tierras Secas de la FAO", "Dirigé par le Programme des terres arides de la FAO", "Под руководством Программы ФАО по засушливым землям", "بقيادة برنامج الفاو للأراضي الجافة", "由粮农组织旱地项目牵头"],
    ["DFSA · Dryland Forest Support Accelerator — hosted under the DSL-IP Knowledge Management structure. A project of the DSL-IP, actively overseen by a UN Officer (programme design · complex programme management · AI · rural development); related to the Programme's behaviour-change research. Pending institutional sign-off.",
      "DFSA · Aceleradora de Apoyo a los Bosques de Tierras Secas — alojada bajo la estructura de Gestión del Conocimiento del DSL-IP. Un proyecto del DSL-IP, supervisado activamente por un funcionario de la ONU (diseño de programas · gestión de programas complejos · IA · desarrollo rural); relacionado con la investigación del Programa sobre cambio de comportamiento. A la espera de la aprobación institucional.",
      "DFSA · Accélérateur de soutien aux forêts des terres arides — hébergée au sein de la structure de gestion des connaissances du DSL-IP. Un projet du DSL-IP, activement supervisé par un fonctionnaire de l'ONU (conception de programmes · gestion de programmes complexes · IA · développement rural) ; lié à la recherche du Programme sur le changement de comportement. En attente de validation institutionnelle.",
      "DFSA · Акселератор поддержки лесов засушливых земель — размещена в рамках структуры управления знаниями DSL-IP. Проект DSL-IP, под активным надзором сотрудника ООН (проектирование программ · управление сложными программами · ИИ · сельское развитие); связан с исследованием Программы по изменению поведения. Ожидает институционального утверждения.",
      "DFSA · مسرِّع دعم غابات الأراضي الجافة — مستضافة ضمن هيكل إدارة المعارف في DSL-IP. مشروع تابع لـ DSL-IP، يشرف عليه بنشاط موظف في الأمم المتحدة (تصميم البرامج · إدارة البرامج المعقّدة · الذكاء الاصطناعي · التنمية الريفية)؛ ويتّصل ببحوث البرنامج المتعلّقة بتغيير السلوك. في انتظار الموافقة المؤسسية.",
      "DFSA · 旱地森林支持加速器——托管于 DSL-IP 知识管理架构之下。DSL-IP 的一个项目，由一名联合国官员积极监督（项目设计 · 复杂项目管理 · 人工智能 · 农村发展）；与本项目的行为改变研究相关。尚待机构正式批准。"],

    // ===== constellation modal =====
    ["Before you enter", "Antes de entrar", "Avant d'entrer", "Прежде чем войти", "قبل أن تدخل", "进入之前"],
    ["The Constellation is an experimental approach", "La Constelación es un enfoque experimental", "La Constellation est une approche expérimentale", "Созвездие — это экспериментальный подход", "الكوكبة نهج تجريبي", "「星座」是一种实验性方法"],
    ["It is an experimental approach to managing dryland forests as complex systems — mapping the Programme as a living network of connected parts rather than a static list. It is a research instrument, under active development and pending validation.",
      "Es un enfoque experimental para gestionar los bosques de tierras secas como sistemas complejos: cartografía el Programa como una red viva de partes conectadas, en lugar de una lista estática. Es un instrumento de investigación, en desarrollo activo y a la espera de validación.",
      "Il s'agit d'une approche expérimentale de la gestion des forêts des terres arides comme systèmes complexes — cartographiant le Programme comme un réseau vivant de parties connectées plutôt qu'une liste statique. C'est un instrument de recherche, en cours de développement et en attente de validation.",
      "Это экспериментальный подход к управлению лесами засушливых земель как сложными системами — он отображает Программу как живую сеть связанных частей, а не как статичный список. Это исследовательский инструмент, находящийся в активной разработке и ожидающий проверки.",
      "إنه نهج تجريبي لإدارة غابات الأراضي الجافة بوصفها نظمًا معقّدة — يرسم البرنامج بوصفه شبكة حيّة من الأجزاء المترابطة بدلاً من قائمة جامدة. وهو أداة بحثية قيد التطوير النشط وفي انتظار التحقّق.",
      "这是一种把旱地森林作为复杂系统加以管理的实验性方法——将本项目描绘为由相互连接的部分组成的鲜活网络，而非一份静态清单。它是一件研究工具，正在积极开发中，尚待验证。"],
    ["Learn more", "Saber más", "En savoir plus", "Подробнее", "اعرف المزيد", "了解更多"],
    ["Enter the Constellation →", "Entrar en la Constelación →", "Entrer dans la Constellation →", "Войти в Созвездие →", "ادخل الكوكبة →", "进入星座 →"]
  ];

  var LANGS = ["es", "fr", "ru", "ar", "zh"];
  var TR = { es: {}, fr: {}, ru: {}, ar: {}, zh: {} };
  ROWS.forEach(function (r) {
    var k = norm(r[0]);
    LANGS.forEach(function (l, i) { TR[l][k] = r[i + 1]; });
  });

  /* count words ("4 items") --------------------------------------------- */
  function localizedCount(n, lang) {
    if (lang === "es") return n + " " + (n === 1 ? "elemento" : "elementos");
    if (lang === "fr") return n + " " + (n === 1 ? "élément" : "éléments");
    if (lang === "ar") return n + " " + (n === 1 ? "عنصر" : "عناصر");
    if (lang === "zh") return n + " 项";
    if (lang === "ru") {
      var a = n % 10, b = n % 100;
      if (a === 1 && b !== 11) return n + " элемент";
      if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return n + " элемента";
      return n + " элементов";
    }
    return n + (n === 1 ? " item" : " items");
  }

  /* ---- DOM registry ----------------------------------------------------- */
  var TRANSPARENT = { B: 1, STRONG: 1, I: 1, EM: 1, U: 1, MARK: 1, SMALL: 1 };
  var SKIP = { SCRIPT: 1, STYLE: 1, TEMPLATE: 1, NOSCRIPT: 1, svg: 1, SVG: 1 };
  var leafReg = [];   // { el, html, text }
  var textReg = [];   // { node, text }
  var built = false;

  function isLeaf(el) {
    var kids = el.children;
    for (var i = 0; i < kids.length; i++) {
      var c = kids[i];
      if (TRANSPARENT[c.tagName]) continue;
      if (c.textContent.trim() === "") continue; // empty inline (icons) ok
      return false;
    }
    return true;
  }

  function register(el) {
    if (SKIP[el.tagName]) return;
    if (el.closest && el.closest("#trModal, #langsw")) return; // skip our own UI
    if (isLeaf(el)) {
      if (el.textContent.trim()) leafReg.push({ el: el, html: el.innerHTML, text: el.textContent });
      return;
    }
    var nodes = el.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      var nd = nodes[i];
      if (nd.nodeType === 3) {
        if (nd.nodeValue.trim()) textReg.push({ node: nd, text: nd.nodeValue });
      } else if (nd.nodeType === 1) {
        register(nd);
      }
    }
  }

  function buildRegistry() {
    leafReg = []; textReg = [];
    if (document.body) register(document.body);
    built = true;
  }

  function lookup(lang, raw) {
    var k = norm(raw);
    if (TR[lang][k] !== undefined) return TR[lang][k];
    var m = k.match(/^(\d+)\s+items?$/);
    if (m) return localizedCount(parseInt(m[1], 10), lang);
    return null;   // no translation → keep English
  }

  function apply(lang) {
    if (!built) buildRegistry();
    leafReg.forEach(function (r) {
      if (lang === "en") { r.el.innerHTML = r.html; return; }
      var t = lookup(lang, r.text);
      if (t !== null) r.el.textContent = t;
      else r.el.innerHTML = r.html;
    });
    textReg.forEach(function (r) {
      if (lang === "en") { r.node.nodeValue = r.text; return; }
      var t = lookup(lang, r.text);
      r.node.nodeValue = (t !== null) ? (/\s$/.test(r.text) ? t + " " : t) : r.text;
    });
  }

  /* ---- popup ------------------------------------------------------------ */
  var POPUP = {
    es: { kick: "Traducción automática", title: "Esta página se ha traducido automáticamente", body: "Estas traducciones se han generado de forma automática y están actualmente en revisión. Pueden contener errores o imprecisiones; en caso de duda, el texto original en inglés prevalece.", ok: "Entendido" },
    fr: { kick: "Traduction automatique", title: "Cette page a été traduite automatiquement", body: "Ces traductions ont été générées automatiquement et sont actuellement en cours de révision. Elles peuvent contenir des erreurs ou des imprécisions ; en cas de doute, le texte original en anglais fait foi.", ok: "J'ai compris" },
    ru: { kick: "Автоматический перевод", title: "Эта страница переведена автоматически", body: "Эти переводы созданы автоматически и в настоящее время проходят проверку. Они могут содержать ошибки или неточности; в случае сомнений приоритет имеет оригинальный текст на английском языке.", ok: "Понятно" },
    ar: { kick: "ترجمة آلية", title: "تُرجمت هذه الصفحة آليًا", body: "أُنشئت هذه الترجمات آليًا وهي قيد المراجعة حاليًا. وقد تتضمّن أخطاء أو معلومات غير دقيقة؛ وعند الشك يُعتدّ بالنص الأصلي باللغة الإنجليزية.", ok: "حسنًا" },
    zh: { kick: "自动翻译", title: "本页面已自动翻译", body: "这些译文由系统自动生成，目前正在校订中。可能存在错误或不准确之处；如有疑问，以英文原文为准。", ok: "知道了" }
  };

  function showPopup(lang) {
    var p = POPUP[lang]; if (!p) return;
    document.getElementById("trKick").textContent = p.kick;
    document.getElementById("trTitle").textContent = p.title;
    document.getElementById("trBody").textContent = p.body;
    document.getElementById("trOk").textContent = p.ok;
    document.getElementById("trModal").classList.add("show");
  }

  /* ---- language switching ---------------------------------------------- */
  var STORE = "drip-lang";
  function setLang(lang, fromUser) {
    apply(lang);
    var root = document.documentElement;
    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.body.classList.remove("i18n-ar", "i18n-zh", "i18n-ru");
    if (lang === "ar") document.body.classList.add("i18n-ar");
    else if (lang === "zh") document.body.classList.add("i18n-zh");
    else if (lang === "ru") document.body.classList.add("i18n-ru");
    document.querySelectorAll(".flag").forEach(function (b) {
      b.classList.toggle("is-on", b.dataset.lang === lang);
    });
    try { localStorage.setItem(STORE, lang); } catch (e) {}
    if (window.lucide) lucide.createIcons();
    if (fromUser) {
      var m = document.getElementById("trModal");
      if (lang === "en") { if (m) m.classList.remove("show"); }
      else showPopup(lang);
    }
  }

  /* ---- self-injected UI (switcher + notice) for pages without it -------- */
  var LANG_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>';
  function injectStyles() {
    if (document.getElementById("dripI18nCss")) return;
    var css =
      ".langsw{display:inline-flex;align-items:center;gap:7px;margin-left:8px}" +
      ".langsw .langsw-ic{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;color:rgba(245,242,232,.6);flex:none}" +
      ".langsw .langsw-ic svg{width:16px;height:16px}" +
      ".langsw .flag{width:25px;height:17px;padding:0;border:1px solid rgba(251,248,239,.45);border-radius:3px;cursor:pointer;position:relative;overflow:hidden;opacity:.5;transition:opacity .15s,transform .15s,box-shadow .15s}" +
      ".langsw .flag:hover{opacity:.85}" +
      ".langsw .flag.is-on{opacity:1;box-shadow:0 0 0 2px rgba(248,177,51,.7)}" +
      ".langsw .flag-en{background:linear-gradient(0deg,transparent 40%,#fff 40% 60%,transparent 60%),linear-gradient(90deg,transparent 38%,#fff 38% 62%,transparent 62%),linear-gradient(0deg,transparent 44%,#C8102E 44% 56%,transparent 56%),linear-gradient(90deg,transparent 42%,#C8102E 42% 58%,transparent 58%),#012169}" +
      ".langsw .flag-es{background:linear-gradient(#AA151B 0 25%,#F1BF00 25% 75%,#AA151B 75%)}" +
      ".langsw .flag-fr{background:linear-gradient(90deg,#0055A4 0 33.34%,#fff 33.34% 66.67%,#EF4135 66.67%)}" +
      ".langsw .flag-ru{background:linear-gradient(#fff 0 33.34%,#0039A6 33.34% 66.67%,#D52B1E 66.67%)}" +
      ".langsw .flag-ar{background:#137a45}" +
      ".langsw .flag-ar::before{content:'';position:absolute;left:50%;top:50%;width:9px;height:1.5px;background:#fff;transform:translate(-50%,-50%);border-radius:2px}" +
      ".langsw .flag-zh{background:#DE2910}" +
      ".langsw .flag-zh::before{content:'\\2605';position:absolute;left:3px;top:50%;transform:translateY(-50%);color:#FFDE00;font-size:8px;line-height:1}" +
      "@media(max-width:880px){.langsw .langsw-ic{display:none}.langsw{margin-left:0}}" +
      ".trmodal{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(12,10,7,.6)}" +
      ".trmodal.show{display:flex}" +
      ".trbox{position:relative;max-width:480px;width:100%;background:#FBF8EF;color:#2b2723;border:1px solid #e2dccc;border-radius:16px;padding:34px 36px 28px;box-shadow:0 24px 60px rgba(20,16,12,.4);text-align:left;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}" +
      "html[dir=rtl] .trbox{text-align:right}" +
      ".trbox .trglyph{display:flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:12px;background:#C3DABA;color:#356046;margin-bottom:16px}" +
      ".trbox .trglyph svg{width:24px;height:24px}" +
      ".trbox .trkick{font-weight:600;text-transform:uppercase;letter-spacing:.13em;font-size:11.5px;color:#a8553f}" +
      ".trbox h3{font-family:Georgia,serif;font-weight:800;font-size:22px;line-height:1.22;margin:8px 0 12px;color:#2b2723}" +
      ".trbox p{font-size:14.5px;line-height:1.62;color:#514a42;margin:0}" +
      ".trbox .trok{margin-top:22px;font-weight:600;font-size:14px;cursor:pointer;background:#477E59;color:#fff;border:none;border-radius:999px;padding:11px 24px}" +
      ".trbox .trx{position:absolute;top:10px;right:14px;background:none;border:none;font-size:24px;line-height:1;color:#9a8f80;cursor:pointer}" +
      "html[dir=rtl] .trbox .trx{right:auto;left:14px}";
    var st = document.createElement("style"); st.id = "dripI18nCss"; st.textContent = css;
    document.head.appendChild(st);
  }
  function injectUI() {
    var needSw = !document.getElementById("langsw");
    var needModal = !document.getElementById("trModal");
    if (needSw || needModal) injectStyles();
    if (needSw) {
      var host = document.querySelector(".drip-topbar .db-nav") || document.querySelector(".dripnav nav");
      var sw = document.createElement("div");
      sw.className = "langsw"; sw.id = "langsw"; sw.setAttribute("role", "group"); sw.setAttribute("aria-label", "Choose a language");
      sw.innerHTML = '<span class="langsw-ic">' + LANG_SVG + '</span>' +
        '<button type="button" class="flag flag-en is-on" data-lang="en" title="English" aria-label="English"></button>' +
        '<button type="button" class="flag flag-es" data-lang="es" title="Espa\u00f1ol" aria-label="Espa\u00f1ol"></button>' +
        '<button type="button" class="flag flag-fr" data-lang="fr" title="Fran\u00e7ais" aria-label="Fran\u00e7ais"></button>' +
        '<button type="button" class="flag flag-ru" data-lang="ru" title="\u0420\u0443\u0441\u0441\u043a\u0438\u0439" aria-label="\u0420\u0443\u0441\u0441\u043a\u0438\u0439"></button>' +
        '<button type="button" class="flag flag-ar" data-lang="ar" title="\u0627\u0644\u0639\u0631\u0628\u064a\u0629" aria-label="\u0627\u0644\u0639\u0631\u0628\u064a\u0629"></button>' +
        '<button type="button" class="flag flag-zh" data-lang="zh" title="\u4e2d\u6587" aria-label="\u4e2d\u6587"></button>';
      if (host) host.appendChild(sw);
      else { sw.style.cssText = "position:fixed;top:10px;right:12px;z-index:10001;background:rgba(31,82,58,.92);padding:6px 9px;border-radius:8px"; document.body.appendChild(sw); }
    }
    if (needModal) {
      var m = document.createElement("div");
      m.className = "trmodal"; m.id = "trModal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true");
      m.innerHTML = '<div class="trbox">' +
        '<button class="trx" id="trClose" aria-label="Close">&times;</button>' +
        '<span class="trglyph">' + LANG_SVG + '</span>' +
        '<div class="trkick" id="trKick">Automated translation</div>' +
        '<h3 id="trTitle">This page has been translated automatically</h3>' +
        '<p id="trBody">These translations were generated automatically and are currently under review. They may contain errors or inaccuracies; where in doubt, the original English text prevails.</p>' +
        '<button class="trok" id="trOk">Got it</button>' +
        '</div>';
      document.body.appendChild(m);
    }
  }

  function init() {
    injectUI();
    var sw = document.getElementById("langsw");
    if (sw) {
      sw.addEventListener("click", function (e) {
        var b = e.target.closest(".flag"); if (!b) return;
        setLang(b.dataset.lang, true);
      });
    }
    var modal = document.getElementById("trModal");
    if (modal) {
      var close = function () { modal.classList.remove("show"); };
      document.getElementById("trClose").addEventListener("click", close);
      document.getElementById("trOk").addEventListener("click", close);
      modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    }
    var saved = "en";
    try { saved = localStorage.getItem(STORE) || "en"; } catch (e) {}
    buildRegistry();
    if (saved !== "en") setLang(saved, false);
    else document.querySelectorAll(".flag").forEach(function (b) { b.classList.toggle("is-on", b.dataset.lang === "en"); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
