import React, { useEffect, useState, useCallback, useRef } from "react";
import Template from "../../components/Template/Template";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

export default function Dashboard() {
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  return (
    <Template>
      <div className="container mt-5">
        <CustomAlert
          show={alert.show}
          dismissible
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: "", type: "" })}
        />
      </div>
    </Template>
  );
}
