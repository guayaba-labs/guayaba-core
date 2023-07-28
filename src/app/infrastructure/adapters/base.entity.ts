import { MODEL_IDENTITY_META_KEY } from "./identity.decorator"

export class BaseEntity {
  static getIdPropertyName() {
    var key = Reflect.getMetadata(MODEL_IDENTITY_META_KEY, this, MODEL_IDENTITY_META_KEY)
    return key
  }
}