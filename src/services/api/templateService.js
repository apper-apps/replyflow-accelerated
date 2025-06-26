import templatesData from '../mockData/templates.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TemplateService {
  constructor() {
    this.templates = [...templatesData];
  }

  async getAll() {
    await delay(250);
    return [...this.templates];
  }

  async getById(id) {
    await delay(200);
    const template = this.templates.find(t => t.Id === parseInt(id, 10));
    return template ? { ...template } : null;
  }

  async getByCategory(category) {
    await delay(200);
    return this.templates.filter(t => t.category === category).map(t => ({ ...t }));
  }

  async create(template) {
    await delay(300);
    const newTemplate = {
      ...template,
      Id: Math.max(...this.templates.map(t => t.Id)) + 1
    };
    this.templates.push(newTemplate);
    return { ...newTemplate };
  }

  async update(id, data) {
    await delay(250);
    const index = this.templates.findIndex(t => t.Id === parseInt(id, 10));
    if (index !== -1) {
      this.templates[index] = { ...this.templates[index], ...data };
      return { ...this.templates[index] };
    }
    throw new Error('Template not found');
  }

  async delete(id) {
    await delay(200);
    const index = this.templates.findIndex(t => t.Id === parseInt(id, 10));
    if (index !== -1) {
      const deleted = this.templates.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error('Template not found');
  }

  async processTemplate(templateId, variables) {
    await delay(150);
    const template = this.templates.find(t => t.Id === parseInt(templateId, 10));
    if (!template) {
      throw new Error('Template not found');
    }

    let content = template.content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value);
    });

    return { processedContent: content, originalTemplate: { ...template } };
  }
}

export default new TemplateService();