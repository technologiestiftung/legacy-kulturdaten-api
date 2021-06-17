export interface ResourceObject {
  id: number | string;
  type: string;
  attributes: object;
  relations?: object;
}

export default class BaseResource {
  public instance: any;

  public type: string;

  private $attributes: object = {};

  private $relations: object = {};

  constructor(instance) {
    this.instance = instance;
  }

  boot() {
    this.id = this.instance.publicId || this.instance.id;
    this.type = this.type || this.instance.constructor.name.toLowerCase();

    this.$attributes = this.instance.serializeAttributes();
    this.$relations = this.$resolveRelations();
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
