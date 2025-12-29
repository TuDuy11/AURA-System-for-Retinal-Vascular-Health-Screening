from infrastructure.databases.mssql import init_mssql

# associations (Table)
from infrastructure.models.associations import user_roles, role_permissions 

# identity & rbac
from infrastructure.models.user_model import UserModel  
from infrastructure.models.roles_model import RoleModel  
from infrastructure.models.permission_model import PermissionModel  
from infrastructure.models.auth_identity_model import AuthIdentityModel  
from infrastructure.models.audit_log_model import AuditLogModel  

# clinic & people
from infrastructure.models.clinic_model import ClinicModel  
from infrastructure.models.clinic_member_model import ClinicMemberModel  
from infrastructure.models.doctor_model import DoctorModel  
from infrastructure.models.patient_model import PatientModel  
from infrastructure.models.doctor_patient_assignment_model import DoctorPatientAssignmentModel  

# core ai
from infrastructure.models.ai_threshold_profile_model import AIThresholdProfileModel  
from infrastructure.models.analysis_request_model import AnalysisRequestModel  
from infrastructure.models.retinal_image_model import RetinalImageModel  
from infrastructure.models.analysis_result_model import AnalysisResultModel  
from infrastructure.models.image_annotation_model import ImageAnnotationModel 

# reports
from infrastructure.models.report_model import ReportModel 
from infrastructure.models.report_item_model import ReportItemModel 

# notifications
from infrastructure.models.notification_template_model import NotificationTemplateModel  
from infrastructure.models.notification_model import NotificationModel  



def init_db(app=None):
     # ✅ Import models/associations TRONG hàm để tránh circular import
    import infrastructure.models.associations  # noqa: F401
    import infrastructure.models  # noqa: F401

    
    init_mssql(app)
