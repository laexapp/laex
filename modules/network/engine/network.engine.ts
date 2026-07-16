import { networkService }
  from "../services/network.service";

class NetworkEngine {

  async activate(
    uid: string
  ): Promise<void> {

    await networkService
      .activate(uid);

  }

}

export const networkEngine =
  new NetworkEngine();