import axios from "axios";

export function getTabs() {
  return axios.get('/mining/api/int/tenants/supertis2/projects/ky_1/analyses/ky/tabs?locale=zh-CN&apiTag=22A0')
}