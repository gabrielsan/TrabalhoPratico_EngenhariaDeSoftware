import { Alert, Col, Row } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { MdError, MdWarning } from "react-icons/md";

interface CustomAlertProps {
  message: string;
  type: string;
  show: boolean;
  onClose: () => void;
  dismissible?: boolean;
}

export default function CustomAlert(props: CustomAlertProps) {
  const { message, type, show, onClose, dismissible } = props;

  return (
    <>
      <Alert
        variant={props.type}
        show={show}
        dismissible={dismissible || false}
        onClose={onClose}
      >
        <Row className="d-flex">
          <Col xs={1}>
            {type === "success" && <FaCheck />}
            {(type === "danger" || type === "info") && <MdError />}
            {type === "warning" && <MdWarning />}
          </Col>
          <Col>
            <p className="m-0">{message}</p>
          </Col>
        </Row>
      </Alert>
    </>
  );
}