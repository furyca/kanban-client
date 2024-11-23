import useModalStore from "@/store/modalStore";
import DeleteTaskModal from "./TaskModals/DeleteTaskModal";
import CreateTaskModal from "./TaskModals/CreateTaskModal";
import UpdateTaskModal from "./TaskModals/UpdateTaskModal";
import LogOutModal from "./LogOutModal";
import { createPortal } from "react-dom";
import ModalContainer from "./ModalContainer";
import DeleteProjectModal from "./ProjectModals/DeleteProjectModal";
import CreateProjectModal from "./ProjectModals/CreateProjectModal";
import UpdateProjectModal from "./ProjectModals/UpdateProjectModal";
import { Lookup } from "./type";

export const modalLookup: Lookup = {
  none: null,
  delete_project: <DeleteProjectModal />,
  create_project: <CreateProjectModal />,
  update_project: <UpdateProjectModal />,
  delete_task: <DeleteTaskModal />,
  create_task: <CreateTaskModal />,
  update_task: <UpdateTaskModal />,
  logout: <LogOutModal />,
};

const ModalRenderer = () => {
  const { modal } = useModalStore();

  return modalLookup[modal] && createPortal(<ModalContainer children={modalLookup[modal]} />, document.body);
};

export default ModalRenderer;
