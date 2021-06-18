export interface ResourceObject {
  id: number | string;
  type: string;
  attributes: {
    [key: string]: any;
  };
  relations?: {
    [key: string]: any;
  };
}

export default class Resource {
  public instance: any;

  public type: string;

  public id: string | number;

  private $attributes: object = {};

  private $relations: object = {};

  constructor(instance) {
    this.instance = instance;
  }

  public boot() {
    this.id = this.instance.publicId || this.instance.id;
    this.type = this.type || this.instance.constructor.name.toLowerCase();

    this.$attributes = this.instance.serializeAttributes();
    this.$relations = this.$resolveRelations();

    return this;
  }

  private $resolveRelations() {
    const relations = {};
    for (const preload of Object.keys(this.instance.$preloaded)) {
      const relation = this.instance[preload];
      if (Array.isArray(relation)) {
        relations[preload] = [];
        for (const instance of relation) {
          const resource = this.$bootRelatedResource(instance);
          relations[preload].push(resource);
        }

        continue;
      }

      relations[preload] = this.$bootRelatedResource(relation);
    }

    return relations;
  }

  public $bootRelatedResource(instance) {
    const resource = new Resource(instance);
    resource.boot();

    return resource;
  }

  public toObject() {
    const resource: ResourceObject = {
      id: this.id,
      type: this.type,
      attributes: {},
    };

    resource.attributes = this.$attributes;
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
