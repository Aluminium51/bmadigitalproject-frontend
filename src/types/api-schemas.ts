import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const HealthSuccess = z
  .object({ status: z.string(), database: z.string(), timestamp: z.string() })
  .passthrough();
const HealthError = z
  .object({ status: z.string(), database: z.string() })
  .passthrough();
const UserProfileResponse = z
  .object({
    userId: z.string().uuid(),
    username: z.string().max(100),
    firstName: z.string().max(100),
    lastName: z.string().max(100),
    email: z.string().max(255),
    position: z.string().max(150).nullable(),
    level: z.string().max(100).nullable(),
    managementPosition: z.string().max(150).nullable(),
    divisionId: z.number().int().gte(-2147483648).lte(2147483647).nullable(),
    mobilePhone: z.string().max(20).nullable(),
    officePhone: z.string().max(20).nullable(),
    internalExtension: z.string().max(10).nullable(),
    isActive: z.boolean(),
    lastLogin: z.string().datetime({ offset: true }).nullable(),
    isVerified: z.boolean(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
    division: z
      .object({
        divisionId: z.number(),
        divisionName: z.string(),
        departmentId: z.number(),
        departmentName: z.string(),
      })
      .passthrough()
      .nullable(),
    roles: z.array(
      z.object({ roleId: z.number(), roleName: z.string() }).passthrough()
    ),
  })
  .passthrough();
const ErrorResponse = z
  .object({ error: z.string(), field: z.string().optional() })
  .passthrough();
const CreateUserRequest = z
  .object({
    username: z.string().min(3).max(100),
    password: z.string().min(8).max(255),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().max(255).email(),
    position: z.string().min(1).max(150).nullish(),
    level: z.string().max(100).nullish(),
    managementPosition: z.string().max(150).nullish(),
    divisionId: z.number().int().gt(0).lte(2147483647).nullish(),
    mobilePhone: z.string().min(6).max(20).nullish(),
    officePhone: z.string().min(6).max(20).nullish(),
    internalExtension: z.string().min(1).max(10).nullish(),
    roleIds: z.array(z.number()).optional().default([1]),
  })
  .passthrough();
const LoginRequest = z
  .object({ username: z.string().min(1), password: z.string().min(1) })
  .passthrough();
const LoginResponse = z
  .object({
    message: z.string(),
    token: z.string(),
    user: z
      .object({
        userId: z.string(),
        username: z.string(),
        firstName: z.string(),
        lastName: z.string(),
      })
      .passthrough(),
  })
  .passthrough();
const SuccessResponse = z.object({ message: z.string() }).passthrough();
const Project = z
  .object({
    id: z.string().uuid(),
    projectCode: z.string().nullable(),
    userId: z.string().uuid(),
    divisionId: z.number(),
    projectStatusId: z.number().nullable(),
    projectTypeId: z.number().nullable(),
    fourQuadrantsId: z.number().nullable(),
    deputyGovernorId: z.number().nullable(),
    externalTaskId: z.string().nullable(),
    projectName: z.string().nullable(),
    projectNameOriginal: z.string().nullable(),
    initialRequestedBudget: z.string().nullable(),
    latestApprovedBudget: z.string().nullable(),
    analystId: z.string().uuid().nullable(),
    assignedBy: z.string().uuid().nullable(),
    assignedAt: z.string().datetime({ offset: true }),
    isPublic: z.boolean(),
    publicToken: z.string().nullable(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
    updatedBy: z.string().uuid().nullable(),
    division: z
      .object({
        id: z.number(),
        name: z.string(),
        departmentId: z.number().nullable(),
        departmentName: z.string().nullable(),
      })
      .passthrough()
      .nullable(),
    status: z
      .object({ id: z.number(), name: z.string() })
      .passthrough()
      .nullable(),
    projectType: z
      .object({ id: z.number(), name: z.string() })
      .passthrough()
      .nullable(),
    owner: z
      .object({
        userId: z.string().uuid(),
        firstName: z.string(),
        lastName: z.string(),
      })
      .passthrough()
      .nullable(),
    analyst: z
      .object({
        userId: z.string().uuid(),
        firstName: z.string(),
        lastName: z.string(),
      })
      .passthrough()
      .nullable(),
  })
  .passthrough();
const PaginatedProjectResponse = z
  .object({
    data: z.array(Project),
    pagination: z
      .object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
      })
      .passthrough(),
  })
  .passthrough();
const CreateProjectRequest = z
  .object({
    projectName: z.string().min(1).max(600),
    projectTypeId: z.number().int().optional(),
    isPublic: z.boolean().optional().default(false),
    fourQuadrantsId: z.number().int().nullable(),
    deputyGovernorId: z.number().int().nullable(),
  })
  .passthrough();
const UpdateProjectRequest = z
  .object({
    projectName: z.string().min(1).max(600),
    projectTypeId: z.number().int(),
    isPublic: z.boolean().default(false),
    fourQuadrantsId: z.number().int().nullable(),
    deputyGovernorId: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const UpdateProjectStatusRequest = z
  .object({ projectStatusId: z.number().int(), remark: z.string().optional() })
  .passthrough();
const UpdateProjectTypeRequest = z
  .object({ projectTypeId: z.number().int() })
  .passthrough();
const AssignProjectRequest = z
  .object({ analystId: z.string().uuid() })
  .passthrough();
const DraftProposalRequest = z
  .object({
    projectId: z.string().uuid(),
    currentStep: z.number().nullable(),
    draftPayload: z.object({}).partial().passthrough(),
    projectName: z.string(),
    objective: z.string(),
    totalBudget: z.number().nullable(),
  })
  .partial()
  .passthrough();
const SubmitProposalRequest = z
  .object({
    projectName: z.string().min(5),
    agencyName: z.string().min(2),
    headOfAgency: z.string().min(2),
    dcioName: z.string().min(2),
    projectManager: z.string().min(2),
    totalBudget: z.number().gte(1),
    budgetsByYear: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            year: z.number().int().gte(2500).lte(2600),
            amount: z.number().gte(1),
            budgetType: z.string().min(1),
          })
          .passthrough()
      )
      .optional()
      .default([]),
    background: z.string().min(10),
    objective: z.string().min(10),
    target: z.string().min(10),
    scope: z.string().min(10),
    projectType: z.enum(["NEW", "REPLACEMENT", "CONTINUOUS"]),
    currentSystemStatus: z.string().min(5),
    currentProblems: z.string().min(5),
    relatedProjects: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            projectName: z.string().min(1),
            agency: z.string().min(1),
            fiscalYear: z.string().min(4),
            relationType: z.string().min(1),
            remark: z.string().optional(),
          })
          .passthrough()
      )
      .optional()
      .default([]),
    manpower: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            agencyPart: z.string().min(1),
            positionLimit: z.number().nullable(),
            occupied: z.number().nullable(),
            vacant: z.number().nullable(),
          })
          .passthrough()
      )
      .optional()
      .default([]),
    existingEquipment: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            itemName: z.string().min(1),
            ageYears: z.number().nullable(),
            quantity: z.number().nullable(),
            user: z.string().min(1),
            location: z.string().min(1),
            remark: z.string().optional(),
          })
          .passthrough()
      )
      .optional()
      .default([]),
    isBmaPlan: z.boolean().optional().default(false),
    isAgencyPlan: z.boolean().optional().default(false),
    agencyStrategy: z.string().optional(),
    agencyIssue: z.string().optional(),
    agencyKpi: z.string().optional(),
    isGovernorPolicy: z.boolean().optional().default(false),
    governorPolicyCode: z.string().optional(),
    governorPolicyName: z.string().optional(),
    obstacleLaws: z.string().optional(),
    appArchitecture: z.string().min(5),
    dataOwner: z.string().min(2),
    dataExchangePlan: z.string().min(5),
    hardwareCosts: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            itemName: z.string().min(1),
            quantity: z.number().gte(1),
            unitPrice: z.number().gte(0).nullable(),
            referenceType: z.enum(["MDES", "MARKET", "PREVIOUS", "OTHER"]),
            mdesMonth: z.string().optional(),
            mdesYear: z.string().optional(),
            mdesItemNo: z.string().optional(),
            marketCount: z.number().nullish(),
            marketCompany: z.string().optional(),
            prevProject: z.string().optional(),
            prevYear: z.string().optional(),
            otherDetail: z.string().optional(),
          })
          .passthrough()
      )
      .optional()
      .default([]),
    softwareCosts: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            itemName: z.string().min(1),
            quantity: z.number().gte(1),
            unitPrice: z.number().gte(0).nullable(),
            referenceType: z.enum(["MDES", "MARKET", "PREVIOUS", "OTHER"]),
            mdesMonth: z.string().optional(),
            mdesYear: z.string().optional(),
            mdesItemNo: z.string().optional(),
            marketCount: z.number().nullish(),
            marketCompany: z.string().optional(),
            prevProject: z.string().optional(),
            prevYear: z.string().optional(),
            otherDetail: z.string().optional(),
          })
          .passthrough()
      )
      .optional()
      .default([]),
    personnelCoreCosts: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            personnelType: z.enum(["CORE", "ASST", "SUPP"]),
            position: z.string().min(1),
            degree: z.string().min(1),
            fieldOfStudy: z.string().optional(),
            experienceYears: z.number().gte(0).nullable(),
            baseSalary: z.number().gte(1),
            multiplier: z.number().nullish(),
            personCount: z.number().gte(1),
            durationMonths: z.number().gte(1),
          })
          .passthrough()
      )
      .optional()
      .default([]),
    personnelAsstCosts: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            personnelType: z.enum(["CORE", "ASST", "SUPP"]),
            position: z.string().min(1),
            degree: z.string().min(1),
            fieldOfStudy: z.string().optional(),
            experienceYears: z.number().gte(0).nullable(),
            baseSalary: z.number().gte(1),
            multiplier: z.number().nullish(),
            personCount: z.number().gte(1),
            durationMonths: z.number().gte(1),
          })
          .passthrough()
      )
      .optional()
      .default([]),
    personnelSuppCosts: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            personnelType: z.enum(["CORE", "ASST", "SUPP"]),
            position: z.string().min(1),
            degree: z.string().min(1),
            fieldOfStudy: z.string().optional(),
            experienceYears: z.number().gte(0).nullable(),
            baseSalary: z.number().gte(1),
            multiplier: z.number().nullish(),
            personCount: z.number().gte(1),
            durationMonths: z.number().gte(1),
          })
          .passthrough()
      )
      .optional()
      .default([]),
    personnelResponsibilities: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            position: z.string(),
            responsibility: z.string().min(1),
          })
          .passthrough()
      )
      .optional()
      .default([]),
    trainingCourses: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            courseName: z.string().min(1),
            trainingMethod: z.string().min(1),
            locationType: z.enum(["GOVERNMENT", "PRIVATE"]),
            hasSpeakerCost: z.boolean().optional().default(false),
            speakerReason: z.string().optional(),
            speakerCosts: z
              .array(
                z
                  .object({
                    id: z.string().uuid().optional(),
                    itemName: z.string().min(1),
                    hours: z.number().gte(1),
                    ratePerHour: z.number().gte(0).nullable(),
                    days: z.number().gte(1),
                  })
                  .passthrough()
              )
              .optional()
              .default([]),
            foodCosts: z
              .array(
                z
                  .object({
                    id: z.string().uuid().optional(),
                    itemName: z.enum([
                      "PARTIAL_MEAL",
                      "FULL_MEAL",
                      "SNACK",
                      "OTHER",
                    ]),
                    mealsCount: z.number().gte(0).nullable(),
                    ratePerMeal: z.number().gte(0).nullable(),
                    traineesCount: z.number().gte(0).nullable(),
                    days: z.number().gte(0).nullable(),
                  })
                  .passthrough()
              )
              .optional()
              .default([]),
          })
          .passthrough()
      )
      .optional()
      .default([]),
    otherCosts: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            itemName: z.string().min(1),
            quantity: z.number().gte(1),
            unitPrice: z.number().gte(0).nullable(),
            remark: z.string().optional(),
            costType: z.enum(["IT", "NON_IT"]),
          })
          .passthrough()
      )
      .optional()
      .default([]),
    durationDays: z.number().gte(1),
    ictPersonnel: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            position: z.string().min(1),
            level: z.string().min(1),
            count: z.number().gte(1),
          })
          .passthrough()
      )
      .optional()
      .default([]),
    cloudRequests: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            systemName: z.string().min(1),
            requestedServiceDate: z
              .string()
              .datetime({ offset: true })
              .nullable(),
            recordedRequestDate: z
              .string()
              .datetime({ offset: true })
              .nullable(),
            vms: z
              .array(
                z
                  .object({
                    id: z.string().uuid().optional(),
                    vmDescription: z.string().min(1),
                    osDatabase: z.string().min(1),
                    vcpu: z.number().gte(0).nullable(),
                    ramGb: z.number().gte(0).nullable(),
                    gpuGb: z.number().gte(0).nullable(),
                    storageGb: z.number().gte(0).nullable(),
                    price: z.number().gte(0).nullable(),
                  })
                  .passthrough()
              )
              .optional()
              .default([]),
          })
          .passthrough()
      )
      .optional()
      .default([]),
    otherReadiness: z.string().optional(),
    expectedBenefits: z.string().min(1),
    isInRoadmap: z.boolean(),
  })
  .passthrough();
const CreateMeeting = z
  .object({
    meetingNo: z.string().max(100),
    title: z.string().max(500),
    meetingTypeId: z.number().int(),
    meetingDate: z.string().datetime({ offset: true }),
    location: z.string().max(500).optional(),
    meetingStatusId: z.number().int(),
  })
  .passthrough();
const Meeting = z
  .object({
    id: z.string().uuid(),
    meetingNo: z.string().max(100),
    title: z.string().max(500),
    meetingTypeId: z.number().int(),
    meetingDate: z.string().datetime({ offset: true }),
    location: z.string().max(500).nullish(),
    meetingStatusId: z.number().int(),
    createdBy: z.string().uuid(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
    updatedBy: z.string().uuid().nullish(),
  })
  .passthrough();
const UpdateMeeting = z
  .object({
    meetingNo: z.string().max(100),
    title: z.string().max(500),
    meetingTypeId: z.number().int(),
    meetingDate: z.string().datetime({ offset: true }),
    location: z.string().max(500),
    meetingStatusId: z.number().int(),
  })
  .partial()
  .passthrough();
const CreateAgenda = z
  .object({
    meetingId: z.string().uuid(),
    projectId: z.string().uuid().optional(),
    agendaNumber: z.string().max(50),
    agendaTypeId: z.number().int(),
    title: z.string().max(500),
    description: z.string().optional(),
  })
  .passthrough();
const Agenda = z
  .object({
    id: z.string().uuid(),
    meetingId: z.string().uuid(),
    projectId: z.string().uuid().nullish(),
    agendaNumber: z.string().max(50),
    agendaTypeId: z.number().int(),
    title: z.string().max(500),
    description: z.string().nullish(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const UpdateAgenda = z
  .object({
    projectId: z.string().uuid(),
    agendaNumber: z.string().max(50),
    agendaTypeId: z.number().int(),
    title: z.string().max(500),
    description: z.string(),
  })
  .partial()
  .passthrough();
const CloudRequest = z
  .object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    projectCode: z.string().nullable(),
    projectName: z.string().nullable(),
    agencyName: z.string().nullable(),
    totalPrice: z.string(),
    systemName: z.string(),
    requestedServiceDate: z.string().datetime({ offset: true }).nullable(),
    recordedRequestDate: z.string().datetime({ offset: true }).nullable(),
    vms: z
      .array(
        z
          .object({
            id: z.string().uuid(),
            vmDescription: z.string(),
            osDatabase: z.string().nullable(),
            vcpu: z.number(),
            ramGb: z.number(),
            gpuGb: z.number(),
            storageGb: z.number(),
            price: z.string(),
          })
          .passthrough()
      )
      .optional()
      .default([]),
  })
  .passthrough();
const DivisionItem = z
  .object({
    id: z.number().int(),
    departmentId: z.number().int(),
    name: z.string().max(255),
  })
  .passthrough();
const DivisionResponse = z
  .object({ data: z.array(DivisionItem) })
  .passthrough();
const LookupItem = z
  .object({ id: z.number().int(), name: z.string().max(255) })
  .passthrough();
const LookupResponse = z.object({ data: z.array(LookupItem) }).passthrough();
const ProjectStatusItem = z
  .object({ id: z.number().int(), statusName: z.string().max(255) })
  .passthrough();
const ProjectStatusResponse = z
  .object({ data: z.array(ProjectStatusItem) })
  .passthrough();

export const schemas = {
  HealthSuccess,
  HealthError,
  UserProfileResponse,
  ErrorResponse,
  CreateUserRequest,
  LoginRequest,
  LoginResponse,
  SuccessResponse,
  Project,
  PaginatedProjectResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  UpdateProjectStatusRequest,
  UpdateProjectTypeRequest,
  AssignProjectRequest,
  DraftProposalRequest,
  SubmitProposalRequest,
  CreateMeeting,
  Meeting,
  UpdateMeeting,
  CreateAgenda,
  Agenda,
  UpdateAgenda,
  CloudRequest,
  DivisionItem,
  DivisionResponse,
  LookupItem,
  LookupResponse,
  ProjectStatusItem,
  ProjectStatusResponse,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/api/v1/auth/login",
    alias: "postApiv1authlogin",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: LoginRequest,
      },
    ],
    response: LoginResponse,
    errors: [
      {
        status: 401,
        description: `รหัสผ่านผิด`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `ยังไม่ได้ยืนยันอีเมล`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `เกิดข้อผิดพลาด`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/auth/logout",
    alias: "postApiv1authlogout",
    description: `ยกเลิกเซสชันปัจจุบันและลบคุกกี้การยืนยันตัวตน`,
    requestFormat: "json",
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 500,
        description: `เกิดข้อผิดพลาดที่เซิร์ฟเวอร์`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/auth/verify",
    alias: "getApiv1authverify",
    requestFormat: "json",
    parameters: [
      {
        name: "token",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `Token ไม่ถูกต้องหรือหมดอายุ`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `เซิร์ฟเวอร์มีปัญหา`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/internal/cloud-requests",
    alias: "getApiv1internalcloudRequests",
    requestFormat: "json",
    parameters: [
      {
        name: "projectId",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "projectCode",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z.object({ data: z.array(CloudRequest) }).passthrough(),
    errors: [
      {
        status: 403,
        description: `ถูกปฏิเสธเนื่องจาก IP ไม่อยู่ใน Whitelist`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/lookups/departments",
    alias: "getApiv1lookupsdepartments",
    requestFormat: "json",
    response: LookupResponse,
  },
  {
    method: "get",
    path: "/api/v1/lookups/deputy-governors",
    alias: "getApiv1lookupsdeputyGovernors",
    requestFormat: "json",
    response: LookupResponse,
  },
  {
    method: "get",
    path: "/api/v1/lookups/divisions",
    alias: "getApiv1lookupsdivisions",
    requestFormat: "json",
    parameters: [
      {
        name: "departmentId",
        type: "Query",
        schema: z.number().nullish(),
      },
    ],
    response: DivisionResponse,
  },
  {
    method: "get",
    path: "/api/v1/lookups/four-quadrants",
    alias: "getApiv1lookupsfourQuadrants",
    requestFormat: "json",
    response: LookupResponse,
  },
  {
    method: "get",
    path: "/api/v1/lookups/project-statuses",
    alias: "getApiv1lookupsprojectStatuses",
    requestFormat: "json",
    response: ProjectStatusResponse,
  },
  {
    method: "post",
    path: "/api/v1/meetings",
    alias: "postApiv1meetings",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateMeeting,
      },
    ],
    response: z.object({ data: Meeting }).passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/meetings",
    alias: "getApiv1meetings",
    requestFormat: "json",
    response: z.object({ data: z.array(Meeting) }).passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/meetings/:id",
    alias: "getApiv1meetingsId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ data: Meeting }).passthrough(),
    errors: [
      {
        status: 404,
        description: `ไม่พบข้อมูล`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "put",
    path: "/api/v1/meetings/:id",
    alias: "putApiv1meetingsId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateMeeting,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ data: Meeting }).passthrough(),
    errors: [
      {
        status: 404,
        description: `ไม่พบข้อมูล`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/meetings/:id",
    alias: "deleteApiv1meetingsId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 404,
        description: `ไม่พบข้อมูล`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/meetings/:meetingId/agendas",
    alias: "getApiv1meetingsMeetingIdagendas",
    requestFormat: "json",
    parameters: [
      {
        name: "meetingId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ data: z.array(Agenda) }).passthrough(),
  },
  {
    method: "post",
    path: "/api/v1/meetings/agendas",
    alias: "postApiv1meetingsagendas",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateAgenda,
      },
    ],
    response: z.object({ data: Agenda }).passthrough(),
    errors: [
      {
        status: 404,
        description: `ไม่พบการประชุม`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "put",
    path: "/api/v1/meetings/agendas/:id",
    alias: "putApiv1meetingsagendasId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateAgenda,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ data: Agenda }).passthrough(),
    errors: [
      {
        status: 404,
        description: `ไม่พบข้อมูล`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/meetings/agendas/:id",
    alias: "deleteApiv1meetingsagendasId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 404,
        description: `ไม่พบข้อมูล`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/projects",
    alias: "getApiv1projects",
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(10),
      },
      {
        name: "search",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "status",
        type: "Query",
        schema: z
          .enum(["draft", "submitted", "all_except_draft", "all"])
          .optional()
          .default("all"),
      },
      {
        name: "ownership",
        type: "Query",
        schema: z
          .enum(["mine", "team_only", "team_and_mine", "all"])
          .optional()
          .default("all"),
      },
    ],
    response: PaginatedProjectResponse,
    errors: [
      {
        status: 500,
        description: `ข้อผิดพลาดเซิร์ฟเวอร์`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/projects",
    alias: "postApiv1projects",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateProjectRequest,
      },
    ],
    response: z.object({ message: z.string(), project: Project }).passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/projects/:id",
    alias: "getApiv1projectsId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Project,
    errors: [
      {
        status: 400,
        description: `รูปแบบ ID ไม่ถูกต้อง`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `ไม่พบข้อมูลโครงการ`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/projects/:id",
    alias: "patchApiv1projectsId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateProjectRequest,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ message: z.string(), project: Project }).passthrough(),
    errors: [
      {
        status: 404,
        description: `ไม่พบข้อมูลโครงการ`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/projects/:id",
    alias: "deleteApiv1projectsId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 404,
        description: `ไม่พบข้อมูลโครงการ`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/projects/:id/assign",
    alias: "patchApiv1projectsIdassign",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ analystId: z.string().uuid() }).passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
  },
  {
    method: "patch",
    path: "/api/v1/projects/:id/status",
    alias: "patchApiv1projectsIdstatus",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateProjectStatusRequest,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
  },
  {
    method: "patch",
    path: "/api/v1/projects/:id/type",
    alias: "patchApiv1projectsIdtype",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ projectTypeId: z.number().int() }).passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
  },
  {
    method: "get",
    path: "/api/v1/proposals/drafts/my",
    alias: "getApiv1proposalsdraftsmy",
    requestFormat: "json",
    response: z
      .object({
        data: z.unknown().nullable(),
        message: z.string(),
        success: z.boolean(),
      })
      .partial()
      .passthrough(),
  },
  {
    method: "get",
    path: "/api/v1/proposals/projects/:projectId",
    alias: "getApiv1proposalsprojectsProjectId",
    requestFormat: "json",
    parameters: [
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        data: z.unknown().nullable(),
        message: z.string(),
        success: z.boolean(),
      })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Invalid project id`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/proposals/projects/:projectId/draft",
    alias: "getApiv1proposalsprojectsProjectIddraft",
    requestFormat: "json",
    parameters: [
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        data: z.unknown().nullable(),
        message: z.string(),
        success: z.boolean(),
      })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Invalid project id`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/proposals/projects/:projectId/draft",
    alias: "postApiv1proposalsprojectsProjectIddraft",
    requestFormat: "json",
    parameters: [
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        data: z.unknown().nullable(),
        message: z.string(),
        success: z.boolean(),
      })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Invalid project id`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/proposals/projects/:projectId/draft",
    alias: "patchApiv1proposalsprojectsProjectIddraft",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: DraftProposalRequest,
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        data: z.unknown().nullable(),
        message: z.string(),
        success: z.boolean(),
      })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Invalid request`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/proposals/projects/:projectId/submit",
    alias: "postApiv1proposalsprojectsProjectIdsubmit",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: SubmitProposalRequest,
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        data: z.unknown().nullable(),
        message: z.string(),
        success: z.boolean(),
      })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Invalid request`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/uploads/document",
    alias: "postApiv1uploadsdocument",
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ file: z.instanceof(File) }).passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "get",
    path: "/api/v1/users",
    alias: "getApiv1users",
    requestFormat: "json",
    response: z.array(UserProfileResponse),
    errors: [
      {
        status: 404,
        description: `ไม่พบข้อมูลผู้ใช้งานในระบบ`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `ข้อผิดพลาดทางเซิร์ฟเวอร์`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/users",
    alias: "postApiv1users",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateUserRequest,
      },
    ],
    response: z
      .object({
        message: z.string(),
        requireVerification: z.boolean(),
        user: z.unknown().nullish(),
      })
      .passthrough(),
    errors: [
      {
        status: 409,
        description: `ข้อมูลซ้ำซ้อน (Conflict)`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `ข้อผิดพลาดทางเซิร์ฟเวอร์`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/users/profile/:userId",
    alias: "getApiv1usersprofile_userId",
    requestFormat: "json",
    parameters: [
      {
        name: "userId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: UserProfileResponse,
    errors: [
      {
        status: 400,
        description: `กรุณาระบุรหัสผู้ใช้งาน`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `ไม่พบรหัสผู้ใช้งานนี้ในฐานข้อมูล`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `ข้อผิดพลาดทางเซิร์ฟเวอร์`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/health",
    alias: "getHealth",
    requestFormat: "json",
    response: HealthSuccess,
    errors: [
      {
        status: 503,
        description: `ระบบมีปัญหาหรือไม่สามารถเชื่อมต่อฐานข้อมูลได้`,
        schema: HealthError,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
