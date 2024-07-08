export const modelColumn = [
    {
        title: '序号',
        align: 'center',
        width: '5%',
        dataIndex: 'index'
    },
    {
        title: '模型名称',
        align: 'center',
        width: '12%',
        dataIndex: 'name',
    },
    {
        title: '标识',
        align: 'center',
        width: '12%',
        dataIndex: 'key'
    },
    {
        title: '版本号',
        align: 'center',
        width: '7%',
        dataIndex: 'version'
    },
    {
        title: '备注',
        align: 'center',
        width: '12%',
        dataIndex: 'description'
    },
    {
        title: '创建时间',
        align: 'center',
        width: '14%',
        dataIndex: 'createDate'
    },
    {
        title: '更新时间',
        align: 'center',
        width: '14%',
        dataIndex: 'updateDate'
    },
    {
        title: '操作',
        align: 'center',
        // width: '35%',
        dataIndex: 'operation'
    }
]

export const definitionColumn = [
    {
        title: '序号',
        align: 'center',
        width: '5%',
        dataIndex: 'index'
    },
    {
        title: '流程名称',
        align: 'center',
        width: '11%',
        dataIndex: 'name'
    },
    {
        title: '标识',
        align: 'center',
        width: '11%',
        dataIndex: 'key'
    },
    {
        title: '状态',
        align: 'center',
        width: '10%',
        dataIndex: 'state'
    },
    {
        title: '流程 XML',
        align: 'center',
        width: '22%',
        dataIndex: 'xmlName'
    },
    {
        title: '流程图片',
        align: 'center',
        width: '25%',
        dataIndex: 'pngName'
    },
    {
        title: '版本号',
        align: 'center',
        width: '7%',
        dataIndex: 'version'
    },
    {
        title: '关联业务路由名',
        align: 'center',
        width: '16%',
        dataIndex: 'businessRoute'
    },
    {
        title: '关联表单组件',
        align: 'center',
        width: '11%',
        dataIndex: 'formName'
    },
    {
        title: '部署时间',
        align: 'center',
        width: '16%',
        dataIndex: 'deployDate'
    },
    {
        title: '操作',
        align: 'center',
        fixed: 'right',
        width: '26%',
        dataIndex: 'operation'
    }
]

export const leaveColumn = [
    {
        title: '序号',
        align: 'center',
        width: '5%',
        dataIndex: 'index'
    },
    {
        title: '请假人',
        align: 'center',
        width: '11%',
        dataIndex: 'username'
    },
    {
        title: '标题',
        align: 'center',
        width: '11%',
        dataIndex: 'title'
    },
    {
        title: '请假类型',
        align: 'center',
        width: '11%',
        dataIndex: 'leaveTypeStr'
    },
    {
        title: '请假开始时间',
        align: 'center',
        width: '11%',
        dataIndex: 'startDateStr'
    },
    {
        title: '请假结束时间',
        align: 'center',
        width: '11%',
        dataIndex: 'endDateStr'
    },
    {
        title: '业务状态',
        align: 'center',
        width: '11%',
        dataIndex: 'statusStr'
    },
    {
        title: '创建日期',
        align: 'center',
        width: '16%',
        dataIndex: 'createDateStr'
    },
    {
        title: '操作',
        align: 'center',
        fixed: 'right',
        width: '20%',
        dataIndex: 'operation'
    }
]

export const taskHistoryColumn = [
    {
        title: '序号',
        align: 'center',
        width: '60px',
        dataIndex: 'index'
    },
    {
        title: '任务名称',
        align: 'center',
        width: '150px',
        dataIndex: 'taskName',
    },
    {
        title: '办理人',
        align: 'center',
        width: '130px',
        dataIndex: 'assignee'
    },
    {
        title: '节点状态',
        align: 'center',
        width: '130px',
        dataIndex: 'status'
    },
    {
        title: '审批意见',
        align: 'center',
        width: '270px',
        dataIndex: 'message'
    },
    {
        title: '开始时间',
        align: 'center',
        width: '180px',
        dataIndex: 'startTime'
    },
    {
        title: '结束时间',
        align: 'center',
        width: '180px',
        dataIndex: 'endTime'
    }
]

export const awaitTaskListColumn = [
    {
        title: '序号',
        align: 'center',
        // width: '60px',
        dataIndex: 'index'
    },
    {
        title: '任务名称',
        align: 'center',
        // width: '130px',
        dataIndex: 'taskName'
    },
    {
        title: '所属流程',
        align: 'center',
        // width: '250px',
    },
    {
        title: '流程发起人',
        align: 'center',
        // width: '150px',
        dataIndex: 'proposer'
    },
    {
        title: '流程状态',
        align: 'center',
        // width: '150px',
        dataIndex: 'processStatus'
    },
    {
        title: '任务开始日期',
        align: 'center',
        // width: '150px',
        dataIndex: 'taskCreateTime'
    },
    {
        title: '操作',
        align: 'center',
        width: '25%',
        dataIndex: 'operation'
    }
]

export const completedTaskListColumn = [
    {
        title: '序号',
        align: 'center',
        dataIndex: 'index',
        width: '5%'
    },
    {
        title: '任务名称',
        align: 'center',
        // width: '130px',
        dataIndex: 'taskName'
    },
    {
        title: '所属流程',
        align: 'center',
        // width: '250px',
    },
    {
        title: '流程发起人',
        align: 'center',
        // width: '150px',
        dataIndex: 'proposer'
    },
    {
        title: '任务开始日期',
        align: 'center',
        // width: '150px',
        dataIndex: 'taskCreateTime'
    },
    {
        title: '任务结束日期',
        align: 'center',
        // width: '150px',
        dataIndex: 'taskEndTime'
    },
    {
        title: '操作',
        align: 'center',
        width: '16%',
        dataIndex: 'operation'
    }
]

export const runningProcessColumn = [
    {
        title: '序号',
        align: 'center',
        width: '5%',
        dataIndex: 'index'
    },
    {
        title: '流程发起人',
        align: 'center',
        width: '11%',
        dataIndex: 'proposer'
    },
    {
        title: '流程名称',
        align: 'center',
        width: '11%',
        dataIndex: 'processInstanceName'
    },
    {
        title: '当前环节',
        align: 'center',
        width: '22%',
        dataIndex: 'currentTaskInfo'
    },
    {
        title: '流程状态',
        align: 'center',
        width: '11%',
        dataIndex: 'processStatus'
    },
    {
        title: '流程实例 ID',
        align: 'center',
        width: '25%',
        dataIndex: 'processInstanceId'
    },
    {
        title: '流程标识',
        align: 'center',
        width: '11%',
        dataIndex: 'processKey'
    },
    {
        title: '版本号',
        align: 'center',
        width: '10%',
        dataIndex: 'version'
    },
    {
        title: '开始时间',
        align: 'center',
        width: '17%',
        dataIndex: 'startTime'
    },
    {
        title: '操作',
        align: 'center',
        fixed: 'right',
        width: '26%',
        dataIndex: 'operation'
    }
]

export const finishProcessColumn = [
    {
        title: '序号',
        align: 'center',
        width: '5%',
        dataIndex: 'index'
    },
    {
        title: '流程发起人',
        align: 'center',
        width: '11%',
        dataIndex: 'proposer'
    },
    {
        title: '流程名称',
        align: 'center',
        width: '11%',
        dataIndex: 'processInstanceName'
    },
    {
        title: '业务状态',
        align: 'center',
        width: '11%',
        dataIndex: 'status'
    },
    {
        title: '详情',
        align: 'center',
        width: '27%',
        dataIndex: 'deleteReason'
    },
    {
        title: '流程实例 ID',
        align: 'center',
        width: '27%',
        dataIndex: 'processInstanceId'
    },
    {
        title: '流程标识',
        align: 'center',
        width: '11%',
        dataIndex: 'processKey'
    },
    {
        title: '版本号',
        align: 'center',
        width: '10%',
        dataIndex: 'version'
    },
    {
        title: '开始时间',
        align: 'center',
        width: '17%',
        dataIndex: 'startTime'
    },
    {
        title: '结束时间',
        align: 'center',
        width: '17%',
        dataIndex: 'endTime'
    },
    {
        title: '操作',
        align: 'center',
        fixed: 'right',
        width: '20%',
        dataIndex: 'operation'
    }]

// select
export const leaveType = [
    {label: '病假', value: 1},
    {label: '事假', value: 2},
    {label: '年假', value: 3},
    {label: '婚假', value: 4},
    {label: '产假', value: 5},
    {label: '丧假', value: 6},
    {label: '探亲', value: 7},
    {label: '调休', value: 8},
    {label: '其他', value: 9}
]

export const businessStatusType = [
    {label: '已撤回', value: 0},
    {label: '待提交', value: 1},
    {label: '处理中', value: 2},
    {label: '已完成', value: 3},
    {label: '已作废', value: 4},
    {label: '已删除', value: 5},
]

export const candidateUser = [
    {label: 'Floyd', value: 'Floyd'},
    {label: 'Chris', value: 'Chris'},
    {label: 'Tina', value: 'Tina'}
]