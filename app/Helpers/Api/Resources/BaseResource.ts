import { defaultLanguage } from 'Config/app';

export interface ResourceObject {
  id: number | string;
  type: string;
  attributes: object;
  relations?: object;
}

export default class BaseResource {
  public instance: any;

  public id: string = 'id';

  public type: string;

  public language: string;

  public attributes: string[] = [];

  private $attributes: object = {};

  private $translations: object = {};

  public relations: string[] = [];

  private $relations: object = {};

  constructor(instance, language = defaultLanguage) {
    this.instance = instance;
    this.language = language;
  }

  boot() {
    this.id = this.instance[this.id];
    this.type = this.type || this.instance.constructor.name.toLowerCase();
    this.$attributes = this.instance.serializeAttributes();

    this.$translations = this.$translate();
    this.$relations = this.$resolveRelations();
  }

  /**
   * Checks if this is a translated model, by looking for a
   * translations property and if it is one, merges
   */
  private $translate() {
    const translations: Array<any> = this.instance.translations;
    if (!translations) {
      return {};
    }

    const translationByLanguage = {};
    for (const translation of translations) {
      translationByLanguage[translation.language] = translation;
    }

    const translation =
      translationByLanguage[this.language] ||
      translationByLanguage[defaultLanguage] ||
      translationByLanguage[0];

    if (translation) {
      return translation.serializeAttributes();
    }

    return {};
  }

  private $resolveRelations() {
    const relations = {};
    const preloadedRelations = this.instance.$preloaded;
    for (const relationName of this.relations) {
      const relation = preloadedRelations[relationName];
      if (!relation) {
        continue;
      }

      if (Array.isArray(relation)) {
        relations[relationName] = [];
        for (const instance of relation) {
          const resource = this.$bootRelatedResource(instance);
          relations[relationName].push(resource);
        }

        continue;
      }

      relations[relationName] = this.$bootRelatedResource(relation);
    }

    return relations;
  }

  public $bootRelatedResource(instance) {
    const ResourceClass = instance.resourceClass || BaseResource;

    const resource = new ResourceClass(instance, this.language);
    resource.boot();

    return resource;
  }

  public toObject() {
    const resource: ResourceObject = {
      id: this.id,
      type: this.type,
      attributes: {},
    };

    // Attributes to be serialized might not be explicitly defined.
    // In this case simply pipe out all of them
    if (!this.attributes.length) {
      resource.attributes = {
        ...this.$attributes,
        ...this.$translations,
      };
    }

    for (const attribute of this.attributes) {
      const value =
        this.$translations[attribute] || this.$attributes[attribute];
      if (value) {
        resource.attributes[attribute] = value;
      }
    }

    if (Object.keys(this.$relations).length) {
      resource.relations = {};
      for (const [name, related] of Object.entries(this.$relations)) {
        if (!Array.isArray(related)) {
          resource.relations[name] = related.toObject();
          continue;
        }

        resource.relations[name] = related.map((related) => related.toObject());
      }
    }

    return resource;
  }
}
