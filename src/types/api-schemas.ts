import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

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
    isVerified: z.boolean(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
    lastLogin: z.string().datetime({ offset: true }).nullable(),
    division: z
      .object({
        divisionId: z.number(),
        divisionCode: z.string().min(8).max(8),
        divisionName: z.string(),
        departmentId: z.number(),
        departmentCode: z.string().min(8).max(8),
        departmentName: z.string(),
      })
      .passthrough()
      .nullable(),
    roles: z.array(
      z.object({ roleId: z.number(), roleName: z.string() }).passthrough()
    ),
  })
  .passthrough();
const PaginatedUserResponse = z
  .object({
    data: z.array(UserProfileResponse),
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
const AnalystWorkload = z
  .object({
    userId: z.string().uuid(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    position: z.string().nullable(),
    activeTaskCount: z.number().int(),
  })
  .passthrough();
const AnalystWorkloadResponse = z
  .object({ data: z.array(AnalystWorkload) })
  .passthrough();
const UpdateUserRolesRequest = z.object({
  roleIds: z.array(z.number().int().gt(0)).min(1).max(20),
});
const UpdateUserStatusRequest = z.object({ isActive: z.boolean() });
const UpdateOwnProfileRequest = z
  .object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    mobilePhone: z.string().min(6).max(20).nullable(),
    officePhone: z.string().min(6).max(20).nullable(),
    internalExtension: z.string().min(1).max(10).nullable(),
  })
  .partial();
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
const RecoveryEmailRequest = z
  .object({ email: z.string().max(255).email() })
  .passthrough();
const ResetPasswordRequest = z
  .object({ token: z.string().min(1), newPassword: z.string().min(8) })
  .passthrough();
const RefreshSessionResponse = z.object({ token: z.string() }).passthrough();
const UploadDocumentRequest = z
  .object({
    file: z.instanceof(File),
    projectId: z.string().uuid(),
    docTypeName: z.string().min(1).max(255),
    description: z.string().max(2000).optional(),
  })
  .passthrough();
const statusIds = z
  .union([z.array(z.number().int().gte(1).lte(15)), z.number(), z.string()])
  .optional();
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
    deletedAt: z.string().datetime({ offset: true }),
    division: z
      .object({
        id: z.number(),
        code: z.string().min(8).max(8),
        name: z.string(),
        departmentId: z.number().nullable(),
        departmentCode: z.string().min(8).max(8).nullable(),
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
    attachments: z
      .array(
        z
          .object({
            id: z.string().uuid(),
            projectId: z.string().uuid(),
            docTypeId: z.number().int(),
            docTypeName: z.string().nullable(),
            uploadedBy: z.string().uuid(),
            fileName: z.string(),
            fileUrl: z.string().url(),
            fileType: z.string(),
            fileSize: z.number().int().nullable(),
            description: z.string().nullable(),
            uploader: z
              .object({
                userId: z.string().uuid(),
                firstName: z.string(),
                lastName: z.string(),
              })
              .passthrough()
              .nullable(),
            createdAt: z.union([z.string(), z.string()]),
            canDelete: z.boolean(),
          })
          .passthrough()
      )
      .optional()
      .default([]),
    permissions: z
      .object({
        canDelete: z.boolean(),
        canManageAttachments: z.boolean(),
        canUpdateProject: z.boolean(),
        canEditProposal: z.boolean(),
        canSubmitProposal: z.boolean(),
        canCancelSubmit: z.boolean(),
        canChangeVisibility: z.boolean(),
      })
      .passthrough()
      .optional(),
    latestReturnFeedback: z
      .object({
        remark: z.string(),
        reviewer: z
          .object({
            userId: z.string().uuid(),
            firstName: z.string(),
            lastName: z.string(),
          })
          .passthrough()
          .nullable(),
        reviewerRole: z.string(),
        createdAt: z.union([z.string(), z.string()]),
        oldStatusId: z.number().int(),
        newStatusId: z.number().int(),
      })
      .passthrough()
      .nullish()
      .default(null),
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
    fourQuadrantsId: z.number().int().nullable(),
    deputyGovernorId: z.number().int().nullable(),
  })
  .passthrough();
const AssignmentProject = z
  .object({
    id: z.string().uuid(),
    projectCode: z.string().nullable(),
    projectName: z.string().nullable(),
    projectType: z
      .object({ id: z.number(), name: z.string() })
      .passthrough()
      .nullable(),
    division: z
      .object({
        id: z.number(),
        code: z.string().min(8).max(8),
        name: z.string(),
        departmentId: z.number().nullable(),
        departmentCode: z.string().min(8).max(8).nullable(),
        departmentName: z.string().nullable(),
      })
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
    projectStatusId: z.number().int(),
    createdAt: z.union([z.string(), z.string()]),
    analystId: z.string().uuid().nullable(),
  })
  .passthrough();
const PaginatedAssignmentProjectResponse = z
  .object({
    data: z.array(AssignmentProject),
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
const BulkAssignProjectRequest = z.object({
  projectIds: z.array(z.string().uuid()).min(1).max(100),
  analystId: z.string().uuid(),
});
const BulkAssignProjectResponse = z
  .object({
    count: z.number().int(),
    analyst: z
      .object({
        userId: z.string().uuid(),
        firstName: z.string(),
        lastName: z.string(),
      })
      .passthrough(),
    projects: z.array(
      z
        .object({
          id: z.string().uuid(),
          projectCode: z.string().nullable(),
          projectStatusId: z.number().int(),
          analystId: z.string().uuid(),
        })
        .passthrough()
    ),
  })
  .passthrough();
const AnalystAssignedProject = z
  .object({
    id: z.string().uuid(),
    projectCode: z.string().nullable(),
    projectName: z.string().nullable(),
    projectType: z
      .object({ id: z.number(), name: z.string() })
      .passthrough()
      .nullable(),
    division: z
      .object({
        id: z.number(),
        code: z.string().min(8).max(8),
        name: z.string(),
        departmentId: z.number().nullable(),
        departmentCode: z.string().min(8).max(8).nullable(),
        departmentName: z.string().nullable(),
      })
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
    projectStatusId: z.number().int(),
    assignedAt: z.union([z.string(), z.string(), z.unknown()]),
    createdAt: z.union([z.string(), z.string()]),
    analystId: z.string().uuid(),
  })
  .passthrough();
const PaginatedAnalystAssignedProjectResponse = z
  .object({
    data: z.array(AnalystAssignedProject),
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
const UpdateProjectRequest = z
  .object({
    projectName: z.string().min(1).max(600),
    projectTypeId: z.number().int(),
    fourQuadrantsId: z.number().int().nullable(),
    deputyGovernorId: z.number().int().nullable(),
  })
  .partial();
const UpdateProjectStatusRequest = z
  .object({
    projectStatusId: z.number().int(),
    projectTypeId: z.number().int().optional(),
    remark: z.string().optional(),
  })
  .passthrough();
const CancelSubmitResponse = z
  .object({
    message: z.string(),
    projectId: z.string().uuid(),
    project: Project,
  })
  .passthrough();
const AnalystReassignmentRequest = z
  .object({ reason: z.string().min(1) })
  .passthrough();
const AnalystWorkflowResponse = z
  .object({ message: z.string(), project: Project })
  .passthrough();
const AnalystReviewRequest = z
  .object({
    decision: z.enum(["approve", "return", "reject"]),
    remark: z.string().min(1),
  })
  .passthrough();
const SecretaryReviewRequest = z.union([
  z
    .object({
      decision: z.literal("approve"),
      projectTypeId: z.number().int().gt(0),
    })
    .passthrough(),
  z
    .object({ decision: z.literal("return"), remark: z.string().min(1) })
    .passthrough(),
  z
    .object({ decision: z.literal("reject"), remark: z.string().min(1) })
    .passthrough(),
]);
const SecretaryReviewResponse = z
  .object({
    message: z.string(),
    decision: z.enum(["approve", "return", "reject"]),
    project: Project,
  })
  .passthrough();
const UpdateProjectVisibilityRequest = z.object({ isPublic: z.boolean() });
const ProjectVisibilityResponse = z
  .object({
    message: z.string(),
    projectId: z.string().uuid(),
    isPublic: z.boolean(),
  })
  .passthrough();
const UpdateProjectTypeRequest = z
  .object({ projectTypeId: z.number().int() })
  .passthrough();
const AssignProjectRequest = z
  .object({ analystId: z.string().uuid() })
  .passthrough();
const PublicProject = z
  .object({
    id: z.string().uuid(),
    projectCode: z.string().nullable(),
    projectName: z.string().nullable(),
    projectNameOriginal: z.string().nullable(),
    projectStatus: z
      .object({ id: z.number(), name: z.string() })
      .passthrough()
      .nullable(),
    projectType: z
      .object({ id: z.number(), name: z.string() })
      .passthrough()
      .nullable(),
  })
  .passthrough();
const PaginatedPublicProjectResponse = z
  .object({
    data: z.array(PublicProject),
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
const SubmittedProposalPatchRequest = z
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
      .default([]),
    isBmaPlan: z.boolean().default(false),
    isAgencyPlan: z.boolean().default(false),
    agencyStrategy: z.string(),
    agencyIssue: z.string(),
    agencyKpi: z.string(),
    isGovernorPolicy: z.boolean().default(false),
    governorPolicyCode: z.string(),
    governorPolicyName: z.string(),
    obstacleLaws: z.string(),
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
      .default([]),
    personnelCoreCosts: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
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
      .default([]),
    personnelAsstCosts: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
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
      .default([]),
    personnelSuppCosts: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
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
      .default([]),
    cloudRequests: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            systemName: z.string().min(1),
            requestedServiceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            recordedRequestDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
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
      .default([]),
    isReady: z.boolean().default(false),
    readinessDetails: z.string(),
    otherReadiness: z.string(),
    expectedBenefits: z.string().min(1),
    isInRoadmap: z.boolean(),
  })
  .partial()
  .passthrough();
const ProposalResponse = z.object({
  id: z.string().uuid(),
  status: z.string(),
  projectId: z.string().uuid().nullable(),
  userId: z.string().uuid(),
  updatedBy: z.string().uuid().nullable(),
  version: z.number().nullable(),
  projectName: z.string().nullable(),
  agencyName: z.string().nullable(),
  headOfAgency: z.string().nullable(),
  dcioName: z.string().nullable(),
  projectManager: z.string().nullable(),
  totalBudget: z.union([z.number(), z.string(), z.unknown()]),
  background: z.string().nullable(),
  objective: z.string().nullable(),
  target: z.string().nullable(),
  scope: z.string().nullable(),
  projectType: z.string().nullable(),
  currentSystemStatus: z.string().nullable(),
  currentProblems: z.string().nullable(),
  isBmaPlan: z.boolean().nullable(),
  isAgencyPlan: z.boolean().nullable(),
  agencyStrategy: z.string().nullable(),
  agencyIssue: z.string().nullable(),
  agencyKpi: z.string().nullable(),
  isGovernorPolicy: z.boolean().nullable(),
  governorPolicyCode: z.string().nullable(),
  governorPolicyName: z.string().nullable(),
  obstacleLaws: z.string().nullable(),
  appArchitecture: z.string().nullable(),
  dataOwner: z.string().nullable(),
  dataExchangePlan: z.string().nullable(),
  isReady: z.boolean().nullable(),
  readinessDetails: z.string().nullable(),
  durationDays: z.number().nullable(),
  otherReadiness: z.string().nullable(),
  expectedBenefits: z.string().nullable(),
  isInRoadmap: z.boolean().nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  budgets: z.array(z.record(z.string(), z.unknown().nullable())),
  relatedProjects: z.array(z.record(z.string(), z.unknown().nullable())),
  manpower: z.array(z.record(z.string(), z.unknown().nullable())),
  existingEquipments: z.array(z.record(z.string(), z.unknown().nullable())),
  hardwareCosts: z.array(z.record(z.string(), z.unknown().nullable())),
  softwareCosts: z.array(z.record(z.string(), z.unknown().nullable())),
  personnelCosts: z.array(z.record(z.string(), z.unknown().nullable())),
  personnelResponsibilities: z.array(z.record(z.string(), z.unknown().nullable())),
  trainings: z.array(z.record(z.string(), z.unknown().nullable())),
  otherCosts: z.array(z.record(z.string(), z.unknown().nullable())),
  ictPersonnel: z.array(z.record(z.string(), z.unknown().nullable())),
  cloudRequests: z.array(z.record(z.string(), z.unknown().nullable())),
});
const ProposalDataResponse = z
  .object({
    data: ProposalResponse.nullable(),
    message: z.string().optional(),
    success: z.boolean().optional(),
  })
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
            requestedServiceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            recordedRequestDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
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
    isReady: z.boolean().optional().default(false),
    readinessDetails: z.string().optional(),
    otherReadiness: z.string().optional(),
    expectedBenefits: z.string().min(1),
    isInRoadmap: z.boolean(),
  })
  .passthrough();
const CreateMeeting = z
  .object({
    meetingNo: z.string().min(1).max(100),
    title: z.string().min(1).max(500),
    meetingTypeId: z.number().int().gt(0),
    meetingDate: z.string().datetime({ offset: true }),
    location: z.string().max(500).nullish(),
    meetingStatusId: z.number().int().gt(0),
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
    meetingType: z
      .object({ id: z.number().int(), name: z.string() })
      .passthrough()
      .nullish(),
    meetingStatus: z
      .object({ id: z.number().int(), name: z.string() })
      .passthrough()
      .nullish(),
    creator: z
      .object({
        userId: z.string().uuid(),
        firstName: z.string(),
        lastName: z.string(),
      })
      .passthrough()
      .nullish(),
  })
  .passthrough();
const UpdateMeeting = z
  .object({
    meetingNo: z.string().min(1).max(100),
    title: z.string().min(1).max(500),
    meetingTypeId: z.number().int().gt(0),
    meetingDate: z.string().datetime({ offset: true }),
    location: z.string().max(500).nullable(),
    meetingStatusId: z.number().int().gt(0),
  })
  .partial()
  .passthrough();
const CreateAgenda = z
  .object({
    meetingId: z.string().uuid(),
    projectId: z.string().uuid().nullish(),
    agendaNumber: z.string().min(1).max(50),
    sortOrder: z.number().int().gt(0).optional(),
    agendaTypeId: z.number().int().gte(1).lte(5),
    title: z.string().min(1).max(500),
    description: z.string().max(5000).nullish(),
  })
  .passthrough();
const Agenda = z
  .object({
    id: z.string().uuid(),
    meetingId: z.string().uuid(),
    projectId: z.string().uuid().nullish(),
    agendaNumber: z.string().max(50),
    sortOrder: z.number().int(),
    agendaTypeId: z.number().int().gte(1).lte(5),
    title: z.string().max(500),
    description: z.string().nullish(),
    project: z
      .object({
        id: z.string().uuid(),
        projectCode: z.string().nullish(),
        projectName: z.string().nullish(),
        initialRequestedBudget: z.string().nullish(),
      })
      .passthrough()
      .nullish(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const UpdateAgenda = z
  .object({
    projectId: z.string().uuid().nullable(),
    agendaNumber: z.string().min(1).max(50),
    sortOrder: z.number().int().gt(0),
    agendaTypeId: z.number().int().gte(1).lte(5),
    title: z.string().min(1).max(500),
    description: z.string().max(5000).nullable(),
  })
  .partial()
  .passthrough();
const RecordResolution = z
  .object({
    resolutionStatusId: z.number().int().gte(1).lte(4),
    comment: z.string().optional(),
  })
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
    code: z.string().min(8).max(8),
    departmentId: z.number().int(),
    name: z.string().max(255),
  })
  .passthrough();
const DivisionResponse = z
  .object({ data: z.array(DivisionItem) })
  .passthrough();
const DepartmentItem = z
  .object({
    id: z.number().int(),
    code: z.string().min(8).max(8),
    name: z.string().max(255),
  })
  .passthrough();
const DepartmentResponse = z
  .object({ data: z.array(DepartmentItem) })
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
const ProjectAttachmentTypeLookupItem = z
  .object({
    id: z.number().int(),
    name: z.string().max(255),
    label: z.string().max(255),
  })
  .passthrough();
const ProjectAttachmentTypeLookupResponse = z
  .object({ data: z.array(ProjectAttachmentTypeLookupItem) })
  .passthrough();

export const schemas = {
  UserProfileResponse,
  PaginatedUserResponse,
  ErrorResponse,
  CreateUserRequest,
  AnalystWorkload,
  AnalystWorkloadResponse,
  UpdateUserRolesRequest,
  UpdateUserStatusRequest,
  UpdateOwnProfileRequest,
  LoginRequest,
  LoginResponse,
  SuccessResponse,
  RecoveryEmailRequest,
  ResetPasswordRequest,
  RefreshSessionResponse,
  UploadDocumentRequest,
  statusIds,
  Project,
  PaginatedProjectResponse,
  CreateProjectRequest,
  AssignmentProject,
  PaginatedAssignmentProjectResponse,
  BulkAssignProjectRequest,
  BulkAssignProjectResponse,
  AnalystAssignedProject,
  PaginatedAnalystAssignedProjectResponse,
  UpdateProjectRequest,
  UpdateProjectStatusRequest,
  CancelSubmitResponse,
  AnalystReassignmentRequest,
  AnalystWorkflowResponse,
  AnalystReviewRequest,
  SecretaryReviewRequest,
  SecretaryReviewResponse,
  UpdateProjectVisibilityRequest,
  ProjectVisibilityResponse,
  UpdateProjectTypeRequest,
  AssignProjectRequest,
  PublicProject,
  PaginatedPublicProjectResponse,
  DraftProposalRequest,
  SubmittedProposalPatchRequest,
  ProposalResponse,
  ProposalDataResponse,
  SubmitProposalRequest,
  CreateMeeting,
  Meeting,
  UpdateMeeting,
  CreateAgenda,
  Agenda,
  UpdateAgenda,
  RecordResolution,
  CloudRequest,
  DivisionItem,
  DivisionResponse,
  DepartmentItem,
  DepartmentResponse,
  LookupItem,
  LookupResponse,
  ProjectStatusItem,
  ProjectStatusResponse,
  ProjectAttachmentTypeLookupItem,
  ProjectAttachmentTypeLookupResponse,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/api/v1/auth/forgot-password",
    alias: "postApiv1authforgotPassword",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ email: z.string().max(255).email() }).passthrough(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 429,
        description: `Too many requests`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/auth/forgot-username",
    alias: "postApiv1authforgotUsername",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ email: z.string().max(255).email() }).passthrough(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 429,
        description: `Too many requests`,
        schema: ErrorResponse,
      },
    ],
  },
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
    method: "post",
    path: "/api/v1/auth/refresh",
    alias: "postApiv1authrefresh",
    requestFormat: "json",
    response: z.object({ token: z.string() }).passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/auth/reset-password",
    alias: "postApiv1authresetPassword",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ResetPasswordRequest,
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `Invalid or expired token`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Server error`,
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
    response: DepartmentResponse,
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
    path: "/api/v1/lookups/project-attachment-types",
    alias: "getApiv1lookupsprojectAttachmentTypes",
    requestFormat: "json",
    response: ProjectAttachmentTypeLookupResponse,
  },
  {
    method: "get",
    path: "/api/v1/lookups/project-statuses",
    alias: "getApiv1lookupsprojectStatuses",
    requestFormat: "json",
    response: ProjectStatusResponse,
  },
  {
    method: "get",
    path: "/api/v1/lookups/project-types",
    alias: "getApiv1lookupsprojectTypes",
    requestFormat: "json",
    response: LookupResponse,
  },
  {
    method: "get",
    path: "/api/v1/lookups/roles",
    alias: "getApiv1lookupsroles",
    requestFormat: "json",
    response: LookupResponse,
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
    method: "post",
    path: "/api/v1/meetings/agendas/:id/resolution",
    alias: "postApiv1meetingsagendasIdresolution",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: RecordResolution,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({ data: z.unknown().nullable() })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Invalid resolution`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 409,
        description: `Invalid workflow state`,
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
        name: "statusIds",
        type: "Query",
        schema: statusIds,
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
        description: `ไม่ได้รับอนุญาต`,
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
    method: "post",
    path: "/api/v1/projects/:id/analyst-reassignment",
    alias: "postApiv1projectsIdanalystReassignment",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ reason: z.string().min(1) }).passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: AnalystWorkflowResponse,
    errors: [
      {
        status: 403,
        description: `ไม่ได้รับอนุญาต`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `สถานะโครงการไม่เป็นปัจจุบัน`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/projects/:id/analyst-review",
    alias: "postApiv1projectsIdanalystReview",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AnalystReviewRequest,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: AnalystWorkflowResponse,
    errors: [
      {
        status: 400,
        description: `ผลการวิเคราะห์ไม่ถูกต้อง`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `ไม่ได้รับอนุญาต`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `สถานะโครงการไม่เป็นปัจจุบัน`,
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
    method: "post",
    path: "/api/v1/projects/:id/cancel-submit",
    alias: "postApiv1projectsIdcancelSubmit",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: CancelSubmitResponse,
    errors: [
      {
        status: 403,
        description: `เฉพาะเจ้าของโครงการเท่านั้น`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `ไม่พบโครงการ`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `สถานะโครงการเปลี่ยนระหว่างดำเนินการ`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/projects/:id/secretary-review",
    alias: "postApiv1projectsIdsecretaryReview",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: SecretaryReviewRequest,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: SecretaryReviewResponse,
    errors: [
      {
        status: 400,
        description: `ผลการพิจารณาไม่ถูกต้องหรือข้อมูลที่จำเป็นไม่ครบถ้วน`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `เฉพาะเลขานุการเท่านั้นที่ตรวจสอบโครงการได้`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `ไม่พบโครงการ`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `โครงการไม่อยู่ในสถานะรอเลขานุการตรวจสอบแล้ว`,
        schema: ErrorResponse,
      },
    ],
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
    method: "patch",
    path: "/api/v1/projects/:id/visibility",
    alias: "patchApiv1projectsIdvisibility",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ isPublic: z.boolean() }),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ProjectVisibilityResponse,
    errors: [
      {
        status: 403,
        description: `เฉพาะผู้ดูแลระบบเท่านั้น`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `ไม่พบโครงการ`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/projects/analyst/assigned",
    alias: "getApiv1projectsanalystassigned",
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
        schema: z.number().int().gte(1).lte(100).optional().default(20),
      },
      {
        name: "search",
        type: "Query",
        schema: z.string().max(100).optional(),
      },
    ],
    response: PaginatedAnalystAssignedProjectResponse,
    errors: [
      {
        status: 403,
        description: `เฉพาะผู้วิเคราะห์เท่านั้นที่เข้าถึงรายการนี้ได้`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/projects/assignment/bulk",
    alias: "postApiv1projectsassignmentbulk",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: BulkAssignProjectRequest,
      },
    ],
    response: BulkAssignProjectResponse,
    errors: [
      {
        status: 400,
        description: `ผู้วิเคราะห์ไม่ถูกต้อง`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `ไม่ได้รับอนุญาต`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `โครงการไม่อยู่ในสถานะรอมอบหมายแล้ว`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/projects/assignment/pending",
    alias: "getApiv1projectsassignmentpending",
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
        schema: z.number().int().gte(1).lte(100).optional().default(20),
      },
      {
        name: "search",
        type: "Query",
        schema: z.string().max(100).optional(),
      },
    ],
    response: PaginatedAssignmentProjectResponse,
    errors: [
      {
        status: 403,
        description: `เฉพาะผู้ดูแลระบบเท่านั้นที่เข้าถึงรายการมอบหมายงานได้`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/projects/secretary/pending",
    alias: "getApiv1projectssecretarypending",
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
    ],
    response: PaginatedProjectResponse,
    errors: [
      {
        status: 403,
        description: `เฉพาะเลขานุการเท่านั้นที่เข้าถึงรายการนี้ได้`,
        schema: ErrorResponse,
      },
    ],
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
    method: "patch",
    path: "/api/v1/proposals/projects/:projectId",
    alias: "patchApiv1proposalsprojectsProjectId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: SubmittedProposalPatchRequest,
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
        status: 403,
        description: `Forbidden`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
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
    response: ProposalDataResponse,
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
    method: "get",
    path: "/api/v1/public/projects",
    alias: "getApiv1publicprojects",
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
        schema: z.number().int().gte(1).lte(100).optional().default(12),
      },
      {
        name: "search",
        type: "Query",
        schema: z.string().max(200).optional(),
      },
    ],
    response: PaginatedPublicProjectResponse,
  },
  {
    method: "get",
    path: "/api/v1/public/projects/:id",
    alias: "getApiv1publicprojectsId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: PublicProject,
    errors: [
      {
        status: 404,
        description: `ไม่พบโครงการสาธารณะ`,
        schema: ErrorResponse,
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
        schema: UploadDocumentRequest,
      },
    ],
    response: z
      .object({
        success: z.boolean(),
        message: z.string(),
        data: z
          .object({
            attachmentId: z.string().uuid(),
            docTypeId: z.number().int(),
            docTypeName: z.string(),
            fileName: z.string(),
            storedFileName: z.string(),
            fileSize: z.number(),
            contentType: z.string(),
            compressionApplied: z.boolean(),
            url: z.string().url(),
            canDelete: z.boolean(),
            uploader: z
              .object({
                userId: z.string().uuid(),
                firstName: z.string(),
                lastName: z.string(),
              })
              .passthrough()
              .nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Missing file/project ID or invalid file type for the document category`,
        schema: z
          .object({ message: z.string(), error: z.string() })
          .partial()
          .passthrough(),
      },
      {
        status: 403,
        description: `The authenticated user cannot upload for this project`,
        schema: z
          .object({ message: z.string(), error: z.string() })
          .partial()
          .passthrough(),
      },
      {
        status: 404,
        description: `Project not found`,
        schema: z
          .object({ message: z.string(), error: z.string() })
          .partial()
          .passthrough(),
      },
      {
        status: 409,
        description: `Uploads are locked for the current project stage`,
        schema: z
          .object({ message: z.string(), error: z.string() })
          .partial()
          .passthrough(),
      },
      {
        status: 413,
        description: `File exceeds the supported size limit`,
        schema: z
          .object({ message: z.string(), error: z.string() })
          .partial()
          .passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/uploads/files/:fileId",
    alias: "deleteApiv1uploadsfilesFileId",
    requestFormat: "json",
    parameters: [
      {
        name: "fileId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({ message: z.string(), error: z.string() })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 403,
        description: `The authenticated user cannot delete this file`,
        schema: z
          .object({ message: z.string(), error: z.string() })
          .partial()
          .passthrough(),
      },
      {
        status: 404,
        description: `File not found`,
        schema: z
          .object({ message: z.string(), error: z.string() })
          .partial()
          .passthrough(),
      },
      {
        status: 409,
        description: `File management is locked for the current project stage`,
        schema: z
          .object({ message: z.string(), error: z.string() })
          .partial()
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/uploads/files/:fileName",
    alias: "getApiv1uploadsfilesFileName",
    requestFormat: "json",
    parameters: [
      {
        name: "fileName",
        type: "Path",
        schema: z.string().min(1),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Uploaded file not found`,
        schema: z
          .object({ message: z.string(), error: z.string() })
          .partial()
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/users",
    alias: "getApiv1users",
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
        schema: z.number().int().gte(1).lte(100).optional().default(20),
      },
      {
        name: "search",
        type: "Query",
        schema: z.string().max(100).optional(),
      },
      {
        name: "sort",
        type: "Query",
        schema: z
          .enum([
            "createdAt",
            "username",
            "name",
            "firstName",
            "email",
            "role",
            "department",
          ])
          .optional()
          .default("createdAt"),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
      {
        name: "role",
        type: "Query",
        schema: z.string().max(50).optional(),
      },
      {
        name: "status",
        type: "Query",
        schema: z.enum(["all", "active", "inactive"]).optional().default("all"),
      },
      {
        name: "department",
        type: "Query",
        schema: z.string().max(255).optional(),
      },
      {
        name: "departmentId",
        type: "Query",
        schema: z.number().int().gt(0).optional(),
      },
      {
        name: "divisionId",
        type: "Query",
        schema: z.number().int().gt(0).optional(),
      },
    ],
    response: PaginatedUserResponse,
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
    method: "patch",
    path: "/api/v1/users/:userId/roles",
    alias: "patchApiv1usersUserIdroles",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateUserRolesRequest,
      },
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
        description: `Invalid role assignment`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `User not found`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/users/:userId/status",
    alias: "patchApiv1usersUserIdstatus",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ isActive: z.boolean() }),
      },
      {
        name: "userId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: UserProfileResponse,
    errors: [
      {
        status: 403,
        description: `Forbidden`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `User not found`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/users/analysts/workload",
    alias: "getApiv1usersanalystsworkload",
    requestFormat: "json",
    response: AnalystWorkloadResponse,
    errors: [
      {
        status: 403,
        description: `Only Admin users may access Analyst workload data`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/users/me",
    alias: "patchApiv1usersme",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateOwnProfileRequest,
      },
    ],
    response: UserProfileResponse,
    errors: [
      {
        status: 400,
        description: `Invalid profile update`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/users/profile/:userId",
    alias: "getApiv1usersprofileUserId",
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
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
