import type { googleImageGenModels } from "../model";

export class GoogleModel {
  private googleURL: string;
  private accessToken: string;
  private modelName: googleImageGenModels;

  constructor(_accessToken: string, _modelName: googleImageGenModels) {
    this.googleURL = "";
    this.accessToken = _accessToken;
    this.modelName = _modelName;
  }
}
