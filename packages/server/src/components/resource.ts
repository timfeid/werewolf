export abstract class Resource {
  abstract getData (): Record<any, any>

  public toObject() {
    return {
      data: this.getData()
    }
  }
}
