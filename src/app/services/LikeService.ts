import axios from "axios";
import { serverApi } from "../../lib/config";
import { Like, LikeInput } from "../../lib/types/Likes";

class LikeService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async createLike(likeRefId: string, token: string): Promise<Like> {
    try {
      const response = await axios.post(
        `${this.path}/${likeRefId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // send user token if protected
          },
        }
      );
      return response.data; // { message, liked }
    } catch (err) {
      console.error("Error toggling like:", err);
      throw err;
    }
  }

  public async getMyLikes(token: string): Promise<Like[]> {
    try {
      const response = await axios.get(`${this.path}/mylikes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Array of liked products
    } catch (err) {
      console.error("Error getting likes:", err);
      throw err;
    }
  }
}

export default LikeService;
