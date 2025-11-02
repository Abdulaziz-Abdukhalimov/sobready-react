import axios from "axios";
import { serverApi } from "../../lib/config";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../../lib/types/member";

class MemberService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getTopUsers(): Promise<Member[]> {
    try {
      const url = this.path + "/user/top-users";
      const result = await axios.get(url);
      console.log("topusers:", result);
      return result.data;
    } catch (error) {
      console.log("Error getTopUsers", error);
      throw error;
    }
  }

  public async getManager(): Promise<Member> {
    try {
      const url = this.path + "/user/manager";
      const result = await axios.get(url);
      console.log("getRestaurant:", result);
      return result.data;
    } catch (error) {
      console.log("Error getTopUsers", error);
      throw error;
    }
  }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      const url = this.path + "/user/signup";
      const result = await axios.post(url, input, { withCredentials: true });

      const member: Member = result.data.member;
      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (error) {
      console.log("err on signup", error);
      throw error;
    }
  }
  public async login(input: LoginInput): Promise<Member> {
    try {
      const url = this.path + "/user/login";
      const result = await axios.post(url, input, { withCredentials: true });

      const member: Member = result.data.member;
      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (error) {
      console.log("err on login", error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      const url = this.path + "/user/logout";
      const result = await axios.post(url, {}, { withCredentials: true });

      localStorage.removeItem("memberData");
      window.location.replace("/");
    } catch (error) {
      console.log("err on logout", error);
      throw error;
    }
  }

  public async updateMember(input: MemberUpdateInput): Promise<Member> {
    try {
      const formData = new FormData();
      formData.append("memberNick", input.memberNick || "");
      formData.append("memberPhone", input.memberPhone || "");
      formData.append("memberAddress", input.memberAddress || "");
      formData.append("memberDesc", input.memberDesc || "");
      formData.append("memberImage", input.memberImage || "");

      const result = await axios(`${serverApi}/user/update`, {
        method: "POST",
        data: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("updateMember:", result);
      localStorage.setItem("memberData", JSON.stringify(result.data));
      return result.data;
    } catch (error) {
      console.log("err on updateMember", error);
      throw error;
    }
  }
}

export default MemberService;
