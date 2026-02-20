import type { googleImageGenModels } from "../model";

export class GoogleModel {
  private accessToken: string;
  private modelName: googleImageGenModels;
  private projectId: string;
  private location: string;

  constructor(
    _accessToken: string,
    _modelName: googleImageGenModels,
    _projectId: string,
    _location: string,
  ) {
    this.accessToken = _accessToken;
    this.modelName = _modelName;
    this.projectId = _projectId;
    this.location = _location;
  }

  private getEndpoint(): string {
    return `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${this.modelName}:predict`;
  }
}
