/**
 * @fileoverview Классификатор сообщений с использованием LLM
 * @description Классифицирует входящие сообщения по категориям с помощью LLM для умной маршрутизации
 * @author Telegram Bot Team
 * @version 1.0.0
 * @since 2024-01-01
 * @requires ../services/llm/llmService
 */

const LLMService = require('../../services/llm/llmService');

/**
 * @typedef {Object} MessageCategory
 * @property {string} id - Уникальный идентификатор категории
 * @property {string} name - Название категории
 * @property {string} description - Описание категории
 * @property {number} priority - Приоритет обработки (1-10)
 * @property {string} handler - Название обработчика
 * @property {Object} metadata - Дополнительные метаданные
 */

/**
 * @typedef {Object} ClassificationResult
 * @property {string} categoryId - ID определенной категории
 * @property {string} categoryName - Название категории
 * @property {number} confidence - Уверенность в классификации (0.0 - 1.0)
 * @property {Object} metadata - Дополнительные данные
 * @property {string} reasoning - Объяснение классификации
 * @property {number} processingTime - Время обработки в миллисекундах
 */

/**
 * @class MessageClassifier
 * @description Классифицирует сообщения с помощью LLM для определения оптимального способа обработки
 * @example
 * const classifier = new MessageClassifier(llmService);
 * const result = await classifier.classifyMessage('Привет, как дела?');
 */
class MessageClassifier {
  /**
   * @constructor
   * @param {LLMService} llmService - Сервис для работы с LLM
   * @throws {Error} Если LLM сервис не передан
   */
  constructor(llmService) {
    if (!llmService) {
      throw new Error('LLM сервис обязателен для MessageClassifier');
    }
    
    this.llmService = llmService;
    this.categories = this.initializeCategories();
    this.isInitialized = false;
    
    console.log('🔧 MessageClassifier инициализирован');
  }

  /**
   * @group Categories Initialization
   * @description Инициализирует предопределенные категории сообщений
   * @returns {Array<MessageCategory>} Массив категорий
   * @private
   */
  initializeCategories() {
    return [
      {
        id: 'greeting',
        name: 'Приветствие',
        description: 'Приветственные сообщения и знакомство',
        priority: 1,
        handler: 'greetingHandler',
        metadata: {
          examples: ['привет', 'здравствуй', 'hi', 'hello'],
          responseType: 'friendly'
        }
      },
      {
        id: 'question',
        name: 'Вопрос',
        description: 'Вопросы пользователя',
        priority: 2,
        handler: 'questionHandler',
        metadata: {
          examples: ['как дела?', 'что это?', 'помоги'],
          responseType: 'informative'
        }
      },
      {
        id: 'request',
        name: 'Запрос',
        description: 'Запросы на выполнение действий',
        priority: 3,
        handler: 'requestHandler',
        metadata: {
          examples: ['сделай это', 'найди информацию', 'покажи'],
          responseType: 'action'
        }
      },
      {
        id: 'feedback',
        name: 'Обратная связь',
        description: 'Отзывы, жалобы, предложения',
        priority: 4,
        handler: 'feedbackHandler',
        metadata: {
          examples: ['спасибо', 'не работает', 'отлично'],
          responseType: 'acknowledgment'
        }
      },
      {
        id: 'casual',
        name: 'Обычный разговор',
        description: 'Неформальное общение',
        priority: 5,
        handler: 'casualHandler',
        metadata: {
          examples: ['как погода', 'что нового', 'расскажи'],
          responseType: 'conversational'
        }
      }
    ];
  }

  /**
   * @group Initialization
   * @description Инициализирует классификатор
   * @returns {Promise<boolean>} true если инициализация успешна
   */
  async initialize() {
    try {
      console.log('🚀 Инициализация MessageClassifier...');
      
      // Проверяем готовность LLM сервиса
      if (this.llmService && typeof this.llmService.isReady === 'function') {
        if (!this.llmService.isReady()) {
          try {
            await this.llmService.initialize();
          } catch (llmError) {
            console.warn('⚠️ LLM сервис не может быть инициализирован:', llmError.message);
            // Продолжаем инициализацию без LLM
          }
        }
      } else {
        console.warn('⚠️ LLM сервис недоступен, классификатор будет работать в fallback режиме');
      }
      
      this.isInitialized = true;
      console.log('✅ MessageClassifier успешно инициализирован');
      
      return true;
    } catch (error) {
      console.error('❌ Ошибка инициализации MessageClassifier:', error);
      // В случае ошибки все равно устанавливаем флаг
      this.isInitialized = true;
      return false;
    }
  }

  /**
   * @group Message Classification
   * @description Классифицирует входящее сообщение
   * @param {string} message - Текст сообщения для классификации
   * @param {Object} [context] - Контекст разговора
   * @returns {Promise<ClassificationResult>} Результат классификации
   */
  async classifyMessage(message, context = {}) {
    if (!this.isInitialized) {
      throw new Error('MessageClassifier не инициализирован. Вызовите initialize()');
    }

    try {
      const startTime = Date.now();
      
      console.log(`🔍 Классифицирую сообщение: "${message}"`);
      
      // Проверяем доступность LLM сервиса
      if (!this.llmService || !this.llmService.isAPIAvailable()) {
        console.log('⚠️ LLM сервис недоступен, использую fallback классификацию');
        return this.getFallbackClassification(message);
      }
      
      // Создаем промпт для классификации
      const classificationPrompt = this.buildClassificationPrompt(message, context);
      
      // Получаем ответ от LLM
      const llmResponse = await this.llmService.generateResponse(classificationPrompt, {
        maxTokens: 200,
        temperature: 0.3,
        systemPrompt: this.getClassificationSystemPrompt()
      });
      
      // Парсим ответ LLM
      const classificationResult = this.parseLLMResponse(llmResponse.content, message);
      
      const processingTime = Date.now() - startTime;
      
      console.log(`✅ Сообщение классифицировано как: ${classificationResult.categoryName}`);
      
      return {
        ...classificationResult,
        processingTime: processingTime
      };
      
    } catch (error) {
      console.error('❌ Ошибка классификации сообщения:', error);
      
      // Возвращаем fallback классификацию
      return this.getFallbackClassification(message);
    }
  }

  /**
   * @group Prompt Building
   * @description Строит промпт для классификации
   * @param {string} message - Текст сообщения
   * @param {Object} context - Контекст разговора
   * @returns {string} Промпт для LLM
   * @private
   */
  buildClassificationPrompt(message, context) {
    const categoriesInfo = this.categories.map(cat => 
      `${cat.id}: ${cat.name} - ${cat.description}`
    ).join('\n');
    
    let prompt = `Классифицируй следующее сообщение по одной из категорий:\n\n${categoriesInfo}\n\n`;
    prompt += `Сообщение: "${message}"\n\n`;
    
    if (context.userHistory) {
      prompt += `История пользователя: ${context.userHistory}\n\n`;
    }
    
    prompt += `Ответь в формате JSON:\n{\n  "categoryId": "id_категории",\n  "confidence": 0.95,\n  "reasoning": "краткое объяснение"\n}`;
    
    return prompt;
  }

  /**
   * @group System Prompts
   * @description Возвращает системный промпт для классификации
   * @returns {string} Системный промпт
   * @private
   */
  getClassificationSystemPrompt() {
    return `Ты - эксперт по классификации сообщений. 
    Твоя задача - определить категорию сообщения пользователя.
    Отвечай только в формате JSON без дополнительного текста.
    Используй русский язык для объяснений.
    Будь точным и объективным в классификации.`;
  }

  /**
   * @group Response Parsing
   * @description Парсит ответ от LLM
   * @param {string} llmResponse - Ответ от LLM
   * @param {string} originalMessage - Исходное сообщение
   * @returns {ClassificationResult} Результат классификации
   * @private
   */
  parseLLMResponse(llmResponse, originalMessage) {
    try {
      // Пытаемся извлечь JSON из ответа
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Находим категорию по ID
        const category = this.categories.find(cat => cat.id === parsed.categoryId);
        
        if (category) {
          return {
            categoryId: category.id,
            categoryName: category.name,
            confidence: Math.min(Math.max(parsed.confidence || 0.8, 0.0), 1.0),
            metadata: category.metadata,
            reasoning: parsed.reasoning || 'Классификация выполнена LLM'
          };
        }
      }
      
      // Если парсинг не удался, используем fallback
      throw new Error('Не удалось распарсить ответ LLM');
      
    } catch (error) {
      console.warn('⚠️ Ошибка парсинга ответа LLM, использую fallback:', error);
      return this.getFallbackClassification(originalMessage);
    }
  }

  /**
   * @group Fallback Classification
   * @description Возвращает fallback классификацию при ошибке LLM
   * @param {string} message - Исходное сообщение
   * @returns {ClassificationResult} Fallback результат
   * @private
   */
  getFallbackClassification(message) {
    const lowerMessage = message.toLowerCase();
    
    // Простая эвристическая классификация
    if (lowerMessage.includes('привет') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
      return this.createClassificationResult('greeting', 0.7, 'Fallback: обнаружены приветственные слова');
    }
    
    if (lowerMessage.includes('?') || lowerMessage.includes('как') || lowerMessage.includes('что')) {
      return this.createClassificationResult('question', 0.7, 'Fallback: обнаружен вопросительный характер');
    }
    
    if (lowerMessage.includes('спасибо') || lowerMessage.includes('thanks')) {
      return this.createClassificationResult('feedback', 0.8, 'Fallback: обнаружена благодарность');
    }
    
    // По умолчанию - обычный разговор
    return this.createClassificationResult('casual', 0.5, 'Fallback: неопределенная категория');
  }

  /**
   * @group Result Creation
   * @description Создает результат классификации
   * @param {string} categoryId - ID категории
   * @param {number} confidence - Уверенность
   * @param {string} reasoning - Объяснение
   * @returns {ClassificationResult} Результат классификации
   * @private
   */
  createClassificationResult(categoryId, confidence, reasoning) {
    const category = this.categories.find(cat => cat.id === categoryId);
    
    return {
      categoryId: categoryId,
      categoryName: category ? category.name : 'Неизвестно',
      confidence: confidence,
      metadata: category ? category.metadata : {},
      reasoning: reasoning
    };
  }

  /**
   * @group Category Management
   * @description Добавляет новую категорию
   * @param {MessageCategory} category - Новая категория
   */
  addCategory(category) {
    if (!category.id || !category.name) {
      throw new Error('Категория должна иметь id и name');
    }
    
    // Проверяем уникальность ID
    if (this.categories.find(cat => cat.id === category.id)) {
      throw new Error(`Категория с ID "${category.id}" уже существует`);
    }
    
    this.categories.push(category);
    
    // Сортируем по приоритету
    this.categories.sort((a, b) => a.priority - b.priority);
    
    console.log(`✅ Добавлена новая категория: ${category.name}`);
  }

  /**
   * @group Accessors
   * @description Возвращает все доступные категории
   * @returns {Array<MessageCategory>} Массив категорий
   */
  getCategories() {
    return [...this.categories];
  }

  /**
   * @group Accessors
   * @description Возвращает категорию по ID
   * @param {string} categoryId - ID категории
   * @returns {MessageCategory|null} Категория или null
   */
  getCategoryById(categoryId) {
    return this.categories.find(cat => cat.id === categoryId) || null;
  }

  /**
   * @group Accessors
   * @description Возвращает информацию о классификаторе
   * @returns {Object} Информация о классификаторе
   */
  getInfo() {
    return {
      name: 'Message Classifier',
      version: '1.0.0',
      isReady: this.isInitialized,
      isLLMAvailable: this.llmService && typeof this.llmService.isAPIAvailable === 'function' && this.llmService.isAPIAvailable(),
      categoriesCount: this.categories.length,
      llmService: this.llmService ? this.llmService.getInfo() : null
    };
  }

  /**
   * @group Accessors
   * @description Возвращает статистику классификации
   * @returns {Object} Статистика
   */
  getStats() {
    return {
      totalCategories: this.categories.length,
      priorityRange: {
        min: Math.min(...this.categories.map(c => c.priority)),
        max: Math.max(...this.categories.map(c => c.priority))
      },
      handlers: this.categories.map(c => c.handler)
    };
  }
}

module.exports = MessageClassifier;
