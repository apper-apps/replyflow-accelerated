import conversationsData from '../mockData/conversations.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ConversationService {
  constructor() {
    this.conversations = [...conversationsData];
  }

  async getAll() {
    await delay(300);
    return [...this.conversations];
  }

  async getById(id) {
    await delay(200);
    const conversation = this.conversations.find(c => c.Id === parseInt(id, 10));
    return conversation ? { ...conversation } : null;
  }

  async getByPlatform(platform) {
    await delay(250);
    return this.conversations.filter(c => c.platform === platform).map(c => ({ ...c }));
  }

  async updateStatus(id, status) {
    await delay(200);
    const index = this.conversations.findIndex(c => c.Id === parseInt(id, 10));
    if (index !== -1) {
      this.conversations[index] = { ...this.conversations[index], status };
      return { ...this.conversations[index] };
    }
    throw new Error('Conversation not found');
  }

  async addMessage(conversationId, message) {
    await delay(300);
    const index = this.conversations.findIndex(c => c.Id === parseInt(conversationId, 10));
    if (index !== -1) {
      const newMessage = {
        ...message,
        Id: Math.max(...this.conversations[index].messages.map(m => m.Id)) + 1,
        timestamp: new Date().toISOString()
      };
      this.conversations[index].messages.push(newMessage);
      this.conversations[index].lastMessageTime = newMessage.timestamp;
      return { ...newMessage };
    }
    throw new Error('Conversation not found');
  }

  async markAsRead(id) {
    await delay(150);
    const index = this.conversations.findIndex(c => c.Id === parseInt(id, 10));
    if (index !== -1) {
      this.conversations[index] = { ...this.conversations[index], unreadCount: 0 };
      return { ...this.conversations[index] };
    }
    throw new Error('Conversation not found');
  }

  async getUnreadCounts() {
    await delay(200);
    const counts = {
      total: 0,
      whatsapp: 0,
      facebook: 0,
      instagram: 0,
      twitter: 0
    };

    this.conversations.forEach(conv => {
      counts.total += conv.unreadCount;
      counts[conv.platform] += conv.unreadCount;
    });

    return counts;
  }

  async searchConversations(query) {
    await delay(300);
    const lowercaseQuery = query.toLowerCase();
    return this.conversations.filter(conv => 
      conv.customerName.toLowerCase().includes(lowercaseQuery) ||
      conv.messages.some(msg => msg.content.toLowerCase().includes(lowercaseQuery))
    ).map(c => ({ ...c }));
  }
}

export default new ConversationService();