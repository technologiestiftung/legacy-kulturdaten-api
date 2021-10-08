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

  public specific: any;

  public type: string;

  public id: string | number;

  public $attributes: {
    [key: string]: any;
  } = {};

  public $relations: {
    [key: string]: any;
  } = {};

  constructor(instance) {
    this.instance = instance;
  }

  public boot() {
    this.id = this.instance.publicId || this.instance.id;
    this.type = this.type || this.instance.constructor.name.toLowerCase();

    // Some models may morph into a more specific type. To make it easier for API
    // consumers those sub types are not returned as a relation but merged into
    // the parent model.
    this.specific = this.instance.specific
      ? this.instance.specific()
      : undefined;

    this.$attributes = this.instance.serializeAttributes();
    this.$relations = this.$resolveRelations();

    this.$morphToSpecific();

    return this;
  }

  private $resolveRelations() {
    const relations = {};

    for (const preload of Object.keys(this.instance.$preloaded)) {
      const relation = this.instance[preload];
      if (Array.isArray(relation)) {
        relations[preload] = [];
        for (const instance of relation) {
          if (!instance) {
            continue;
          }

          const resource = this.$bootRelatedResource(instance);
          relations[preload].push(resource);
        }

        continue;
      }

      if (relation) {
        if (this.specific === relation) {
          continue;
        }

        relations[preload] = this.$bootRelatedResource(relation);
      }
    }

    return relations;
  }

  public $bootRelatedResource(instance) {
    const resource = new Resource(instance);
    resource.boot();

    return resource;
  }

  private $morphToSpecific() {
    if (!this.specific) {
      return;
    }

    // If there is a specific model, we also update the type to match the specific model
    this.type =
      this.specific.type || this.specific.constructor.name.toLowerCase();

    const specificResource = this.$bootRelatedResource(this.specific);
    this.$attributes = Object.assign(
      {},
      specificResource.$attributes,
      this.$attributes
    );
    this.$relations = Object.assign(
      {},
      specificResource.$relations,
      this.$relations
    );
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
