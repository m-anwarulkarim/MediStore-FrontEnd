import { getAllUsers } from "../../../../test/admin";

const AdminMainPage = async () => {
  const data = await getAllUsers();
  console.log(data);
  return <div></div>;
};

export default AdminMainPage;
