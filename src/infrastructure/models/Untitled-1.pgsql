/* ==========================================================
   POSTGRESQL 16+ - BUSINESS FIXED (KEEP SAME TABLE NAMES)
   ========================================================== */

-- =========================
-- 0) SAFE DROP (Postgres-friendly)
-- =========================
-- Drop tables trước sẽ tự drop index/constraints liên quan.
DROP TABLE IF EXISTS USER_ROLES CASCADE;
DROP TABLE IF EXISTS "USER" CASCADE;

DROP TABLE IF EXISTS USAGE_LOGS CASCADE;
DROP TABLE IF EXISTS SUBSCRIPTIONS CASCADE;
DROP TABLE IF EXISTS PLANS CASCADE;
DROP TABLE IF EXISTS PAYMENTS CASCADE;

DROP TABLE IF EXISTS SCREENING_CAMPAIGNS CASCADE;
DROP TABLE IF EXISTS CREATE_A_CAMPAIGN CASCADE;
DROP TABLE IF EXISTS CAMPAIGN_REQUESTS CASCADE;

DROP TABLE IF EXISTS REPORT_ITEMS CASCADE;
DROP TABLE IF EXISTS REPORTS CASCADE;

DROP TABLE IF EXISTS ROLE_PERMISSIONS CASCADE;
DROP TABLE IF EXISTS ROLES CASCADE;
DROP TABLE IF EXISTS PERMISSIONS CASCADE;

DROP TABLE IF EXISTS NOTIFICATION_TEMPLATES CASCADE;
DROP TABLE IF EXISTS NOTIFICATIONS CASCADE;

DROP TABLE IF EXISTS MESSAGES CASCADE;
DROP TABLE IF EXISTS CONVERSATIONS CASCADE;

DROP TABLE IF EXISTS MEDICAL_NOTES CASCADE;
DROP TABLE IF EXISTS IMAGE_ANNOTATIONS CASCADE;
DROP TABLE IF EXISTS DOCTOR_REVIEWS CASCADE;

DROP TABLE IF EXISTS ASSIGNED CASCADE;
DROP TABLE IF EXISTS ASSIGNMENT CASCADE;
DROP TABLE IF EXISTS BELONGING_TO CASCADE;
DROP TABLE IF EXISTS DOCTOR_PATIENT_ASSIGNMENTS CASCADE;

DROP TABLE IF EXISTS DOCTORS CASCADE;
DROP TABLE IF EXISTS PATIENTS CASCADE;

DROP TABLE IF EXISTS RETINAL_IMAGES CASCADE;
DROP TABLE IF EXISTS ANALYSIS_RESULTS CASCADE;
DROP TABLE IF EXISTS AI_THRESHOLD_PROFILES CASCADE;
DROP TABLE IF EXISTS ANALYSIS_REQUESTS CASCADE;

DROP TABLE IF EXISTS AI_MODELS CASCADE;
DROP TABLE IF EXISTS RETRAINING_JOBS CASCADE;
DROP TABLE IF EXISTS AUDIT_LOGS CASCADE;

DROP TABLE IF EXISTS AUTH_IDENTITIES CASCADE;
DROP TABLE IF EXISTS AI_FEEDBACK CASCADE;

DROP TABLE IF EXISTS CLINICS CASCADE;
DROP TABLE IF EXISTS CLINIC_MEMBERS CASCADE;

-- =========================
-- 1) TABLES (create)
-- =========================

/*==============================================================*/
/* Table: AI_FEEDBACK                                           */
/*==============================================================*/
create table AI_FEEDBACK (
FEEDBACK_ID          INT4                 not null,
FEEDBACK_TYPE        CHAR(50)             null,
COMMENT              VARCHAR(255)         null,
constraint PK_AI_FEEDBACK primary key (FEEDBACK_ID)
);

/*==============================================================*/
/* Index: AI_FEEDBACK_PK                                        */
/* (Giữ giống PD: dù PK đã có index, vẫn cho tồn tại)           */
/*==============================================================*/
create unique index AI_FEEDBACK_PK on AI_FEEDBACK (
FEEDBACK_ID
);

/*==============================================================*/
/* Table: RETRAINING_JOBS                                       */
/*==============================================================*/
create table RETRAINING_JOBS (
JOB_ID_              INT4                 not null,
TRIGGER_REASON       CHAR(255)            null,
DATASET_REF          CHAR(255)            null,
IP_ADDRESS           CHAR(45)             null,
CREATED_AT           DATE                 null,
METRICS_JSON         TEXT                 null,
constraint PK_RETRAINING_JOBS primary key (JOB_ID_)
);

create unique index RETRAINING_JOBS_PK on RETRAINING_JOBS (JOB_ID_);

/*==============================================================*/
/* Table: AI_MODELS                                             */
/*==============================================================*/
create table AI_MODELS (
MODEL_ID             INT4                 not null,
JOB_ID_              INT4                 null,        -- FIX: nullable (model có thể chưa gắn job)
VERSION              CHAR(50)             null,
DEPLOYED             BOOL                 null,
IP_ADDRESS           CHAR(45)             null,
constraint PK_AI_MODELS primary key (MODEL_ID)
);

create unique index AI_MODELS_PK on AI_MODELS (MODEL_ID);
create index RETRAINING_FK on AI_MODELS (JOB_ID_);

/*==============================================================*/
/* Table: AUDIT_LOGS                                            */
/*==============================================================*/
create table AUDIT_LOGS (
LOG_ID               INT4                 not null,
MODEL_ID_            CHAR(50)             null,
ENTITY_TYPE          CHAR(50)             null,
_DATASET_REF         INT4                 null,
IP_ADDRESS           CHAR(45)             null,
CREATED_AT           DATE                 null,
constraint PK_AUDIT_LOGS primary key (LOG_ID)
);

create unique index AUDIT_LOGS_PK on AUDIT_LOGS (LOG_ID);

/*==============================================================*/
/* Table: MEDICAL_NOTES                                         */
/*==============================================================*/
create table MEDICAL_NOTES (
NOTE_ID              INT4                 not null,
NOTE_TYPE            CHAR(50)             null,
CONTENTS             TEXT                 null,
CREATE_AT            DATE                 null,
constraint PK_MEDICAL_NOTES primary key (NOTE_ID)
);

create unique index MEDICAL_NOTES_PK on MEDICAL_NOTES (NOTE_ID);

/*==============================================================*/
/* Table: IMAGE_ANNOTATIONS                                     */
/*==============================================================*/
create table IMAGE_ANNOTATIONS (
ANNOTATION_ID        INT4                 not null,
ANNOTATION_TYPE      CHAR(50)             null,
ANNOTATION_URL       CHAR(500)            null,
CREATE_AT            DATE                 null,
constraint PK_IMAGE_ANNOTATIONS primary key (ANNOTATION_ID)
);

create unique index IMAGE_ANNOTATIONS_PK on IMAGE_ANNOTATIONS (ANNOTATION_ID);

/*==============================================================*/
/* Table: DOCTOR_REVIEWS                                        */
/*==============================================================*/
create table DOCTOR_REVIEWS (
REVIEW_ID            INT4                 not null,
FINAL_RISK_LEVEL     VARCHAR(100)         null,
DOCTOR_NOTES_        VARCHAR(255)         null,
REVIEW_AT            DATE                 null,
constraint PK_DOCTOR_REVIEWS primary key (REVIEW_ID)
);

create unique index DOCTOR_REVIEWS_PK on DOCTOR_REVIEWS (REVIEW_ID);

/*==============================================================*/
/* Table: ANALYSIS_RESULTS                                      */
/*==============================================================*/
create table ANALYSIS_RESULTS (
RESULT_ID            INT4                 not null,
ANNOTATION_ID        INT4                 null,   -- FIX: nullable (có thể chưa có annotation)
REVIEW_ID            INT4                 null,   -- FIX: nullable (review là bước sau)
IMAGE_ID             INT4                 not null, -- FIX: result thuộc về 1 image
RISK_LEVEL           CHAR(20)             null,
PREDICTED_LABELS_JSON TEXT                 null,
GENERATED_AT         DATE                 null,
STATUS               CHAR(255)            null,
constraint PK_ANALYSIS_RESULTS primary key (RESULT_ID)
);

create unique index ANALYSIS_RESULTS_PK on ANALYSIS_RESULTS (RESULT_ID);
create index AI_RESULT_FK on ANALYSIS_RESULTS (IMAGE_ID);
create index CAPTION_FK on ANALYSIS_RESULTS (ANNOTATION_ID);
create index BROWSE_FK on ANALYSIS_RESULTS (REVIEW_ID);

/*==============================================================*/
/* Table: RETINAL_IMAGES                                        */
/*==============================================================*/
create table RETINAL_IMAGES (
IMAGE_ID             INT4                 not null,
RESULT_ID            INT4                 null, -- FIX: nullable + bỏ FK ngược (image trước result)
IMAGE_TYPE           CHAR(50)             null,
STORAGE_URL          CHAR(500)            null,
CHECKSUM             CHAR(255)            null,
UPLOADED_AT          DATE                 null,
METADATA_JSON        TEXT                 null,
constraint PK_RETINAL_IMAGES primary key (IMAGE_ID)
);

create unique index RETINAL_IMAGES_PK on RETINAL_IMAGES (IMAGE_ID);
create index AI_RESULT2_FK on RETINAL_IMAGES (RESULT_ID);

/*==============================================================*/
/* Table: USAGE_LOGS                                            */
/*==============================================================*/
create table USAGE_LOGS (
USAGE_ID             INT4                 not null,
USED_UNITS           INT4                 null,
USED_AT              DATE                 null,
constraint PK_USAGE_LOGS primary key (USAGE_ID)
);

create unique index USAGE_LOGS_PK on USAGE_LOGS (USAGE_ID);

/*==============================================================*/
/* Table: ANALYSIS_REQUESTS                                     */
/*==============================================================*/
create table ANALYSIS_REQUESTS (
REQUEST_ID           INT4                 not null,
USAGE_ID             INT4                 null,  -- FIX: nullable (chạy AI mới phát sinh usage)
IMAGE_ID             INT4                 not null,
NOTE_ID              INT4                 null,  -- FIX: nullable
FEEDBACK_ID          INT4                 null,  -- FIX: nullable (feedback là bước sau)
REQUESTER_TYPE       CHAR(50)             null,
IP_ADDRESS           CHAR(45)             null,
COMPLETED_AT         DATE                 null,
MODEL_VERSION        CHAR(50)             null,
constraint PK_ANALYSIS_REQUESTS primary key (REQUEST_ID)
);

create unique index ANALYSIS_REQUESTS_PK on ANALYSIS_REQUESTS (REQUEST_ID);
create index AI_IMPROVEMENT_FEEDBACK_FK on ANALYSIS_REQUESTS (FEEDBACK_ID);
create index CONTAINS_PHOTOS_FK on ANALYSIS_REQUESTS (IMAGE_ID);
create index MINUS_TURNS_FK on ANALYSIS_REQUESTS (USAGE_ID);
create index RESULTS_FK on ANALYSIS_REQUESTS (NOTE_ID);

/*==============================================================*/
/* Table: AI_THRESHOLD_PROFILES                                 */
/*==============================================================*/
create table AI_THRESHOLD_PROFILES (
PROFILE_ID           INT4                 not null,
REQUEST_ID           INT4                 not null,
NAME                 VARCHAR(255)         null,
THRESHOLDS           TEXT                 null,
ACTIVE               BOOL                 null,
constraint PK_AI_THRESHOLD_PROFILES primary key (PROFILE_ID)
);

create unique index AI_THRESHOLD_PROFILES_PK on AI_THRESHOLD_PROFILES (PROFILE_ID);
create index APPLY_FK on AI_THRESHOLD_PROFILES (REQUEST_ID);

-- =========================
-- Clinic / Subscription / Plan / Payment
-- =========================

create table PAYMENTS (
PAYMENT_ID           INT4                 not null,
OWNER_TYPE           CHAR(50)             null,
OWNER_USER_ID_       INT4                 null,
AMOUNT               DECIMAL(18,2)        null,
METHOD               CHAR(50)             null,
PROVIDER             CHAR(50)             null,
TRANSACTION_CODE     CHAR(100)            null,
STATUS_              CHAR(255)            null,
PAID_AT              DATE                 null,
constraint PK_PAYMENTS primary key (PAYMENT_ID)
);
create unique index PAYMENTS_PK on PAYMENTS (PAYMENT_ID);

create table SUBSCRIPTIONS (
SUBSCRIPTION_ID      INT4                 not null,
USAGE_ID             INT4                 null,
PAYMENT_ID           INT4                 null,
CLINICS_ID           INT4                 not null,
OWNER_TYPE           CHAR(50)             null,
END_AT               DATE                 null,
_STATUS              CHAR(255)            null,
REMAINING_QUOTA      INT4                 null,
constraint PK_SUBSCRIPTIONS primary key (SUBSCRIPTION_ID)
);
create unique index SUBSCRIPTIONS_PK on SUBSCRIPTIONS (SUBSCRIPTION_ID);
create index RECORD_USAGE_FK on SUBSCRIPTIONS (USAGE_ID);
create index OWN_THE_PACKAGE2_FK on SUBSCRIPTIONS (CLINICS_ID);
create index PAYMENT_FK on SUBSCRIPTIONS (PAYMENT_ID);

create table PLANS (
PLAN_ID              INT4                 not null,
SUBSCRIPTION_ID      INT4                 not null,
NAME                 VARCHAR(255)         null,
PRICE                DECIMAL(18,2)        null,
CURRENCY             CHAR(10)             null,
QUOTA_IMAGES         INT4                 null,
DURATION_DAYS        INT4                 null,
ACTIVE               BOOL                 null,
constraint PK_PLANS primary key (PLAN_ID)
);
create unique index PLANS_PK on PLANS (PLAN_ID);
create index REGISTERED_FK on PLANS (SUBSCRIPTION_ID);

create table CLINIC_MEMBERS (
CLINIC_MEMBER_ID     INT4                 not null,
MEMBER_ROLE          CHAR(50)             null,
IP_ADDRESS           CHAR(45)             null,
JOINED_AT            DATE                 null,
constraint PK_CLINIC_MEMBERS primary key (CLINIC_MEMBER_ID)
);
create unique index CLINIC_MEMBERS_PK on CLINIC_MEMBERS (CLINIC_MEMBER_ID);

create table CLINICS (
CLINICS_ID           INT4                 not null,
SUBSCRIPTION_ID      INT4                 null,   -- FIX: nullable (đúng nghiệp vụ: subscription trỏ clinic)
REQUEST_ID           INT4                 null,   -- FIX: nullable (clinic không "sở hữu" request)
CLINIC_MEMBER_ID     INT4                 null,   -- FIX: nullable
CLINICS_NAME_        CHAR(255)            null,
ADDRESS              CHAR(45)             null,
VERIFICATION_STATUS  CHAR(255)            null,
VERIFIED_AT          CHAR(255)            null,
CREATE_AT            DATE                 null,
constraint PK_CLINICS primary key (CLINICS_ID)
);
create unique index CLINICS_PK on CLINICS (CLINICS_ID);
create index MEMBER_MANAGEMENT_FK on CLINICS (CLINIC_MEMBER_ID);
create index UPLOAD_FK on CLINICS (REQUEST_ID);
create index OWN_THE_PACKAGE_FK on CLINICS (SUBSCRIPTION_ID);

-- =========================
-- Users / Roles / Permissions
-- =========================

create table ROLES (
ROLE_ID              INT4                 not null,
ROLE_NAME            CHAR(255)            null,
DESCRIPTION          TEXT                 null,
UPDATED_AT           DATE                 null,
constraint PK_ROLES primary key (ROLE_ID)
);
create unique index ROLES_PK on ROLES (ROLE_ID);

create table PERMISSIONS (
PERMISSIONS_ID       INT4                 not null,
PERMISSION_CODE      CHAR(100)            null,
DESCRIPTION          TEXT                 null,
constraint PK_PERMISSIONS primary key (PERMISSIONS_ID)
);
create unique index PERMISSIONS_PK on PERMISSIONS (PERMISSIONS_ID);

create table ROLE_PERMISSIONS (
ROL_ROLE_ID          INT4                 not null,
PER_PERMISSIONS_ID   INT4                 not null,
ROLE_ID              INT4                 null,
PERMISSIONS_ID       INT4                 null,
constraint PK_ROLE_PERMISSIONS primary key (ROL_ROLE_ID, PER_PERMISSIONS_ID)
);
create unique index ROLE_PERMISSIONS_PK on ROLE_PERMISSIONS (ROL_ROLE_ID, PER_PERMISSIONS_ID);
create index ROLE_PERMISSIONS_FK on ROLE_PERMISSIONS (ROL_ROLE_ID);
create index ROLE_PERMISSIONS2_FK on ROLE_PERMISSIONS (PER_PERMISSIONS_ID);

create table "USER" (
USER_ID              INT4                 not null,

-- FIX NGHIỆP VỤ: để nullable, không ép user phải có hết mọi thứ
DOCTOR_ID            INT4                 null,
PATIENTS_ID          INT4                 null,
CLINIC_MEMBER_ID     INT4                 null,
REPORT_ID            INT4                 null,
NOTIFICATION_ID      INT4                 null,
REQUEST_ID           INT4                 null,
CONVERSATION_ID      INT4                 null,
SUBSCRIPTION_ID      INT4                 null,
IDENTITIES_ID        INT4                 null,
LOG_ID               INT4                 null,

EMAIL_               CHAR(255)            null,
PASSWORD             CHAR(255)            null,
FULL_NAME            VARCHAR(255)         null,
PHONE                CHAR(255)            null,
AVATAR_URL           VARCHAR(255)         null,
constraint PK_USER primary key (USER_ID)
);
create unique index USER_PK on "USER" (USER_ID);

-- giữ index như PD sinh ra
create index DOCTOR_INFORMATION2_FK on "USER" (DOCTOR_ID);
create index IDENTITIE2_FK on "USER" (IDENTITIES_ID);
create index CREATE_A_REPORT_FK on "USER" (REPORT_ID);
create index RECEIVE2_FK on "USER" (NOTIFICATION_ID);
create index RECORD_FK on "USER" (LOG_ID);
create index SEND_A_MESSAGE_FK on "USER" (CONVERSATION_ID);
create index PATIENT_INFORMATION_FK on "USER" (PATIENTS_ID);
create index SEND_REQUEST_FK on "USER" (REQUEST_ID);
create index PARTICIPATE_FK on "USER" (CLINIC_MEMBER_ID);
create index PACKAGE_OWNERSHIP_FK on "USER" (SUBSCRIPTION_ID);

create table AUTH_IDENTITIES (
IDENTITIES_ID        INT4                 not null,
USER_ID              INT4                 not null,
PROVIDER_            CHAR(255)            null,
CREATE_AT            DATE                 null,
PROVIDER_USER_ID     CHAR(255)            null,
constraint PK_AUTH_IDENTITIES primary key (IDENTITIES_ID)
);
create unique index AUTH_IDENTITIES_PK on AUTH_IDENTITIES (IDENTITIES_ID);
create index IDENTITIE_FK on AUTH_IDENTITIES (USER_ID);

create table USER_ROLES (
USE_USER_ID          INT4                 not null,
ROL_ROLE_ID          INT4                 not null,
USER_ID              INT4                 null,
ROLE_ID              INT4                 null,
constraint PK_USER_ROLES primary key (USE_USER_ID, ROL_ROLE_ID)
);
create unique index USER_ROLES_PK on USER_ROLES (USE_USER_ID, ROL_ROLE_ID);
create index USER_ROLES_FK on USER_ROLES (USE_USER_ID);
create index USER_ROLES2_FK on USER_ROLES (ROL_ROLE_ID);

-- =========================
-- Doctors / Patients / Assignments
-- =========================

create table CONVERSATIONS (
CONVERSATION_ID      INT4                 not null,
MESSAGE_ID           INT4                 null, -- FIX: nullable (đúng nghiệp vụ: messages mới trỏ conversation)
IP_ADDRESS           CHAR(45)             null,
constraint PK_CONVERSATIONS primary key (CONVERSATION_ID)
);
create unique index CONVERSATIONS_PK on CONVERSATIONS (CONVERSATION_ID);
create index CONTAINS_MESSAGES_FK on CONVERSATIONS (MESSAGE_ID);

create table MESSAGES (
MESSAGE_ID           INT4                 not null,
-- FIX NGHIỆP VỤ: thêm cột conversation (giữ table name, thêm cột là cách ít phá nhất)
CONVERSATION_ID      INT4                 null,
SENDER_USER_ID       CHAR(255)            null,
MESSAGE_TYPE         CHAR(255)            null,
CONTENT              TEXT                 null,
ATTACHMENT_URL       CHAR(255)            null,
constraint PK_MESSAGES primary key (MESSAGE_ID)
);
create unique index MESSAGES_PK on MESSAGES (MESSAGE_ID);

create table DOCTORS (
DOCTOR_ID            INT4                 not null,
CONVERSATION_ID      INT4                 null,  -- FIX: nullable
USER_ID              INT4                 null,
REVIEW_ID            INT4                 null,  -- FIX: nullable
FEEDBACK_ID          INT4                 null,  -- FIX: nullable
NOTE_ID              INT4                 null,  -- FIX: nullable
SPECIALTY            VARCHAR(255)         null,
LICENSE_NO           CHAR(255)            null,
UPDATED_AT           DATE                 null,
constraint PK_DOCTORS primary key (DOCTOR_ID)
);
create unique index DOCTORS_PK on DOCTORS (DOCTOR_ID);
create index DOCTOR_INFORMATION_FK on DOCTORS (USER_ID);
create index SEND_FEEDBACK_FK on DOCTORS (FEEDBACK_ID);
create index CREATE_CONVERSATIONS_FK on DOCTORS (CONVERSATION_ID);
create index BROWSE_DOCTOR_FK on DOCTORS (REVIEW_ID);
create index WRITE_FK on DOCTORS (NOTE_ID);

create table PATIENTS (
PATIENTS_ID          INT4                 not null,
CONVERSATION_ID      INT4                 null,  -- FIX: nullable
REQUEST_ID           INT4                 null,  -- FIX: nullable (request thuộc image/workflow, không nhét vào patient bắt buộc)
NOTE_ID              INT4                 null,
USER_ID              INT4                 null,
PATIENT_CODE         CHAR(100)            null,
DOB                  DATE                 null,
GENDER               CHAR(10)             null,
MEDICAL_PROFILE_JSON TEXT                 null,
UPDATED_AT           DATE                 null,
constraint PK_PATIENTS primary key (PATIENTS_ID)
);
create unique index PATIENTS_PK on PATIENTS (PATIENTS_ID);
create index CREATE_A_CONVERSATION_FK on PATIENTS (CONVERSATION_ID);
create index PATIENT_INFORMATION2_FK on PATIENTS (USER_ID);
create index SUBJECT_OF_ANALYSIS_FK on PATIENTS (REQUEST_ID);
create index HISTORY_NOTES_FK on PATIENTS (NOTE_ID);

create table DOCTOR_PATIENT_ASSIGNMENTS (
ASSIGNMENTS_ID       INT4                 not null,
IP_ADDRESS           CHAR(45)             null,
ASSGNED_AT           DATE                 null,
constraint PK_DOCTOR_PATIENT_ASSIGNMENTS primary key (ASSIGNMENTS_ID)
);
create unique index DOCTOR_PATIENT_ASSIGNMENTS_PK on DOCTOR_PATIENT_ASSIGNMENTS (ASSIGNMENTS_ID);

create table ASSIGNMENT (
DOCTOR_ID            INT4                 not null,
ASSIGNMENTS_ID       INT4                 not null,
constraint PK_ASSIGNMENT primary key (DOCTOR_ID, ASSIGNMENTS_ID)
);
create unique index ASSIGNMENT_PK on ASSIGNMENT (DOCTOR_ID, ASSIGNMENTS_ID);
create index ASSIGNMENT_FK on ASSIGNMENT (DOCTOR_ID);
create index ASSIGNMENT2_FK on ASSIGNMENT (ASSIGNMENTS_ID);

create table ASSIGNED (
ASSIGNMENTS_ID       INT4                 not null,
PATIENTS_ID          INT4                 not null,
constraint PK_ASSIGNED primary key (ASSIGNMENTS_ID, PATIENTS_ID)
);
create unique index ASSIGNED_PK on ASSIGNED (ASSIGNMENTS_ID, PATIENTS_ID);
create index ASSIGNED_FK on ASSIGNED (ASSIGNMENTS_ID);
create index ASSIGNED2_FK on ASSIGNED (PATIENTS_ID);

create table BELONGING_TO (
ASSIGNMENTS_ID       INT4                 not null,
CLINICS_ID           INT4                 not null,
constraint PK_BELONGING_TO primary key (ASSIGNMENTS_ID, CLINICS_ID)
);
create unique index BELONGING_TO_PK on BELONGING_TO (ASSIGNMENTS_ID, CLINICS_ID);
create index BELONGING_TO_FK on BELONGING_TO (ASSIGNMENTS_ID);
create index BELONGING_TO2_FK on BELONGING_TO (CLINICS_ID);

-- =========================
-- Campaign / Reports / Notifications
-- =========================

create table SCREENING_CAMPAIGNS (
CAMPAIGN_ID          INT4                 not null,
NAME                 VARCHAR(255)         null,
START_DATE           DATE                 null,
END_DATE             DATE                 null,
DESCRIPTION          TEXT                 null,
constraint PK_SCREENING_CAMPAIGNS primary key (CAMPAIGN_ID)
);
create unique index SCREENING_CAMPAIGNS_PK on SCREENING_CAMPAIGNS (CAMPAIGN_ID);

create table CREATE_A_CAMPAIGN (
CLINICS_ID           INT4                 not null,
CAMPAIGN_ID          INT4                 not null,
constraint PK_CREATE_A_CAMPAIGN primary key (CLINICS_ID, CAMPAIGN_ID)
);
create unique index CREATE_A_CAMPAIGN_PK on CREATE_A_CAMPAIGN (CLINICS_ID, CAMPAIGN_ID);
create index CREATE_A_CAMPAIGN_FK on CREATE_A_CAMPAIGN (CLINICS_ID);
create index CREATE_A_CAMPAIGN2_FK on CREATE_A_CAMPAIGN (CAMPAIGN_ID);

create table CAMPAIGN_REQUESTS (
ANA_REQUEST_ID       INT4                 not null,
SCR_CAMPAIGN_ID      INT4                 not null,
CAMPAIGN_ID          INT4                 null,
REQUEST_ID           INT4                 null,
constraint PK_CAMPAIGN_REQUESTS primary key (ANA_REQUEST_ID, SCR_CAMPAIGN_ID)
);
create unique index CAMPAIGN_REQUESTS_PK on CAMPAIGN_REQUESTS (ANA_REQUEST_ID, SCR_CAMPAIGN_ID);
create index CAMPAIGN_REQUESTS_FK on CAMPAIGN_REQUESTS (ANA_REQUEST_ID);
create index CAMPAIGN_REQUESTS2_FK on CAMPAIGN_REQUESTS (SCR_CAMPAIGN_ID);

create table REPORTS (
REPORT_ID            INT4                 not null,
REPORT_TYPE          CHAR(50)             null,
FILE_PDF_URL         CHAR(512)            null,
FILE_CSV_URL         CHAR(512)            null,
CREATED_AT           DATE                 null,
constraint PK_REPORTS primary key (REPORT_ID)
);
create unique index REPORTS_PK on REPORTS (REPORT_ID);

create table REPORT_ITEMS (
REP_REPORT_ID        INT4                 not null,
ANA_REQUEST_ID       INT4                 not null,
REPORT_ID            INT4                 not null,
REQUEST_ID           INT4                 not null,
REPORT_ITEM_ID       INT4                 not null,
ITEM_VALUE           VARCHAR(255)         null,
ITEM_TYPE            CHAR(50)             null,
constraint PK_REPORT_ITEMS primary key (REP_REPORT_ID, ANA_REQUEST_ID)
);
create unique index REPORT_ITEMS_PK on REPORT_ITEMS (REP_REPORT_ID, ANA_REQUEST_ID);
create index REPORT_ITEMS_FK on REPORT_ITEMS (REP_REPORT_ID);
create index REPORT_ITEMS2_FK on REPORT_ITEMS (ANA_REQUEST_ID);

create table NOTIFICATIONS (
NOTIFICATION_ID      INT4                 not null,
USER_ID              INT4                 null,
TITLE                CHAR(255)            null,
_BODY                TEXT                 null,
TYPE_                CHAR(50)             null,
REF_TYPE             CHAR(50)             null,
IP_ADDRESS           CHAR(45)             null,
READ_AT              DATE                 null,
constraint PK_NOTIFICATIONS primary key (NOTIFICATION_ID)
);
create unique index NOTIFICATIONS_PK on NOTIFICATIONS (NOTIFICATION_ID);
create index RECEIVE_FK on NOTIFICATIONS (USER_ID);

create table NOTIFICATION_TEMPLATES (
TEMPLATE_ID          INT4                 not null,
NOTIFICATION_ID      INT4                 not null,
CODE                 CHAR(100)            null,
TITLE_TPL            CHAR(255)            null,
BODY_TPL             TEXT                 null,
CHANNEL              CHAR(50)             null,
ACTIVE               BOOL                 null,
constraint PK_NOTIFICATION_TEMPLATES primary key (TEMPLATE_ID)
);
create unique index NOTIFICATION_TEMPLATES_PK on NOTIFICATION_TEMPLATES (TEMPLATE_ID);
create index SAMPLE_MAKING_FK on NOTIFICATION_TEMPLATES (NOTIFICATION_ID);

-- =========================
-- 2) FOREIGN KEYS (business-fixed)
-- =========================

-- AI models -> retraining jobs
alter table AI_MODELS
   add constraint FK_AI_MODEL_RETRAININ_RETRAINI foreign key (JOB_ID_)
      references RETRAINING_JOBS (JOB_ID_)
      on delete set null on update restrict;

-- threshold profiles -> analysis requests
alter table AI_THRESHOLD_PROFILES
   add constraint FK_AI_THRES_APPLY_ANALYSIS foreign key (REQUEST_ID)
      references ANALYSIS_REQUESTS (REQUEST_ID)
      on delete restrict on update restrict;

-- analysis requests -> feedback/image/usage/note
alter table ANALYSIS_REQUESTS
   add constraint FK_ANALYSIS_AI_IMPROV_AI_FEEDB foreign key (FEEDBACK_ID)
      references AI_FEEDBACK (FEEDBACK_ID)
      on delete set null on update restrict;

alter table ANALYSIS_REQUESTS
   add constraint FK_ANALYSIS_CONTAINS__RETINAL_ foreign key (IMAGE_ID)
      references RETINAL_IMAGES (IMAGE_ID)
      on delete restrict on update restrict;

alter table ANALYSIS_REQUESTS
   add constraint FK_ANALYSIS_MINUS_TUR_USAGE_LO foreign key (USAGE_ID)
      references USAGE_LOGS (USAGE_ID)
      on delete set null on update restrict;

alter table ANALYSIS_REQUESTS
   add constraint FK_ANALYSIS_RESULTS_MEDICAL_ foreign key (NOTE_ID)
      references MEDICAL_NOTES (NOTE_ID)
      on delete set null on update restrict;

-- analysis results -> image / annotation / doctor review
alter table ANALYSIS_RESULTS
   add constraint FK_ANALYSIS_AI_RESULT_RETINAL_ foreign key (IMAGE_ID)
      references RETINAL_IMAGES (IMAGE_ID)
      on delete restrict on update restrict;

alter table ANALYSIS_RESULTS
   add constraint FK_ANALYSIS_CAPTION_IMAGE_AN foreign key (ANNOTATION_ID)
      references IMAGE_ANNOTATIONS (ANNOTATION_ID)
      on delete set null on update restrict;

alter table ANALYSIS_RESULTS
   add constraint FK_ANALYSIS_BROWSE_DOCTOR_R foreign key (REVIEW_ID)
      references DOCTOR_REVIEWS (REVIEW_ID)
      on delete set null on update restrict;

-- (FIX nghiệp vụ) KHÔNG tạo FK ngược RETINAL_IMAGES.RESULT_ID -> ANALYSIS_RESULTS
-- Vì image tồn tại trước result. RESULT_ID giữ để join logic/app hoặc dùng view.

-- doctor-patient assignment join tables
alter table ASSIGNMENT
   add constraint FK_ASSIGNME_ASSIGNMEN_DOCTORS foreign key (DOCTOR_ID)
      references DOCTORS (DOCTOR_ID)
      on delete restrict on update restrict;

alter table ASSIGNMENT
   add constraint FK_ASSIGNME_ASSIGNMEN_DOCTOR_P foreign key (ASSIGNMENTS_ID)
      references DOCTOR_PATIENT_ASSIGNMENTS (ASSIGNMENTS_ID)
      on delete restrict on update restrict;

alter table ASSIGNED
   add constraint FK_ASSIGNED_ASSIGNED_DOCTOR_P foreign key (ASSIGNMENTS_ID)
      references DOCTOR_PATIENT_ASSIGNMENTS (ASSIGNMENTS_ID)
      on delete restrict on update restrict;

alter table ASSIGNED
   add constraint FK_ASSIGNED_ASSIGNED2_PATIENTS foreign key (PATIENTS_ID)
      references PATIENTS (PATIENTS_ID)
      on delete restrict on update restrict;

alter table BELONGING_TO
   add constraint FK_BELONGIN_BELONGING_DOCTOR_P foreign key (ASSIGNMENTS_ID)
      references DOCTOR_PATIENT_ASSIGNMENTS (ASSIGNMENTS_ID)
      on delete restrict on update restrict;

alter table BELONGING_TO
   add constraint FK_BELONGIN_BELONGING_CLINICS foreign key (CLINICS_ID)
      references CLINICS (CLINICS_ID)
      on delete restrict on update restrict;

-- campaign requests
alter table CAMPAIGN_REQUESTS
   add constraint FK_CAMPAIGN_CAMPAIGN__ANALYSIS foreign key (ANA_REQUEST_ID)
      references ANALYSIS_REQUESTS (REQUEST_ID)
      on delete restrict on update restrict;

alter table CAMPAIGN_REQUESTS
   add constraint FK_CAMPAIGN_CAMPAIGN__SCREENIN foreign key (SCR_CAMPAIGN_ID)
      references SCREENING_CAMPAIGNS (CAMPAIGN_ID)
      on delete restrict on update restrict;

-- clinics - campaign
alter table CREATE_A_CAMPAIGN
   add constraint FK_CREATE_A_CREATE_A__CLINICS foreign key (CLINICS_ID)
      references CLINICS (CLINICS_ID)
      on delete restrict on update restrict;

alter table CREATE_A_CAMPAIGN
   add constraint FK_CREATE_A_CREATE_A__SCREENIN foreign key (CAMPAIGN_ID)
      references SCREENING_CAMPAIGNS (CAMPAIGN_ID)
      on delete restrict on update restrict;

-- doctors -> user (đúng nghiệp vụ: doctor profile gắn user)
alter table DOCTORS
   add constraint FK_DOCTORS_DOCTOR_IN_USER foreign key (USER_ID)
      references "USER" (USER_ID)
      on delete set null on update restrict;

-- doctors -> feedback/note/review (để nullable + set null)
alter table DOCTORS
   add constraint FK_DOCTORS_SEND_FEED_AI_FEEDB foreign key (FEEDBACK_ID)
      references AI_FEEDBACK (FEEDBACK_ID)
      on delete set null on update restrict;

alter table DOCTORS
   add constraint FK_DOCTORS_WRITE_MEDICAL_ foreign key (NOTE_ID)
      references MEDICAL_NOTES (NOTE_ID)
      on delete set null on update restrict;

alter table DOCTORS
   add constraint FK_DOCTORS_BROWSE_DO_DOCTOR_R foreign key (REVIEW_ID)
      references DOCTOR_REVIEWS (REVIEW_ID)
      on delete set null on update restrict;

-- patients -> user
alter table PATIENTS
   add constraint FK_PATIENTS_PATIENT_I_USER foreign key (USER_ID)
      references "USER" (USER_ID)
      on delete set null on update restrict;

-- patients -> notes / conversations (nullable)
alter table PATIENTS
   add constraint FK_PATIENTS_HISTORY_N_MEDICAL_ foreign key (NOTE_ID)
      references MEDICAL_NOTES (NOTE_ID)
      on delete set null on update restrict;

-- auth identities -> user
alter table AUTH_IDENTITIES
   add constraint FK_AUTH_IDE_IDENTITIE_USER foreign key (USER_ID)
      references "USER" (USER_ID)
      on delete restrict on update restrict;

-- notifications -> user
alter table NOTIFICATIONS
   add constraint FK_NOTIFICA_RECEIVE_USER foreign key (USER_ID)
      references "USER" (USER_ID)
      on delete set null on update restrict;

alter table NOTIFICATION_TEMPLATES
   add constraint FK_NOTIFICA_SAMPLE_MA_NOTIFICA foreign key (NOTIFICATION_ID)
      references NOTIFICATIONS (NOTIFICATION_ID)
      on delete restrict on update restrict;

-- subscriptions links
alter table SUBSCRIPTIONS
   add constraint FK_SUBSCRIP_OWN_THE_P_CLINICS foreign key (CLINICS_ID)
      references CLINICS (CLINICS_ID)
      on delete restrict on update restrict;

alter table SUBSCRIPTIONS
   add constraint FK_SUBSCRIP_PAYMENT_PAYMENTS foreign key (PAYMENT_ID)
      references PAYMENTS (PAYMENT_ID)
      on delete set null on update restrict;

alter table SUBSCRIPTIONS
   add constraint FK_SUBSCRIP_RECORD_US_USAGE_LO foreign key (USAGE_ID)
      references USAGE_LOGS (USAGE_ID)
      on delete set null on update restrict;

alter table PLANS
   add constraint FK_PLANS_REGISTERE_SUBSCRIP foreign key (SUBSCRIPTION_ID)
      references SUBSCRIPTIONS (SUBSCRIPTION_ID)
      on delete restrict on update restrict;

-- rbac links
alter table ROLE_PERMISSIONS
   add constraint FK_ROLE_PER_ROLE_PERM_ROLES foreign key (ROL_ROLE_ID)
      references ROLES (ROLE_ID)
      on delete restrict on update restrict;

alter table ROLE_PERMISSIONS
   add constraint FK_ROLE_PER_ROLE_PERM_PERMISSI foreign key (PER_PERMISSIONS_ID)
      references PERMISSIONS (PERMISSIONS_ID)
      on delete restrict on update restrict;

alter table USER_ROLES
   add constraint FK_USER_ROL_USER_ROLE_USER foreign key (USE_USER_ID)
      references "USER" (USER_ID)
      on delete restrict on update restrict;

alter table USER_ROLES
   add constraint FK_USER_ROL_USER_ROLE_ROLES foreign key (ROL_ROLE_ID)
      references ROLES (ROLE_ID)
      on delete restrict on update restrict;

-- reports
alter table REPORT_ITEMS
   add constraint FK_REPORT_I_REPORT_IT_REPORTS foreign key (REP_REPORT_ID)
      references REPORTS (REPORT_ID)
      on delete restrict on update restrict;

alter table REPORT_ITEMS
   add constraint FK_REPORT_I_REPORT_IT_ANALYSIS foreign key (ANA_REQUEST_ID)
      references ANALYSIS_REQUESTS (REQUEST_ID)
      on delete restrict on update restrict;


