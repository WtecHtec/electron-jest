import React, { useState, useEffect } from 'react';
import {
    Drawer,
    Card,
    Space,
    Badge,
    Tag,
    Typography,
    Progress,
    Button,
    Empty,
    Collapse
} from 'antd';
import ReactJson from 'react-json-view';

const { Text } = Typography;
const { Panel } = Collapse;

interface ExecutionData {
    executionId: string;
    eventType: string;
    timestamp: Date;
    startTime?: string;
    currentStep: number;
    totalSteps: number;
    currentTask?: any;
    taskName?: string;
    nodeType?: string;
    duration?: number;
    completedTasks?: any[];
    remainingTasks?: any[];
    error?: string;
    result?: any;
    isRunning: boolean;
    // 添加日志相关字段
    level?: string;
    message?: string;
    args?: any[];
    // 添加原始事件数据
    rawEventData?: any;
}

interface ExecutionStatusPanelProps {
    visible?: boolean;
    onClose?: () => void;
    setEdges?: any;
}

const ExecutionStatusPanel: React.FC<ExecutionStatusPanelProps> = ({
    visible = false,
    onClose,
    setEdges
}) => {
    const [executionHistory, setExecutionHistory] = useState<ExecutionData[]>([]);
    const [drawerVisible, setDrawerVisible] = useState(visible);
    const [currentExecution, setCurrentExecution] = useState<ExecutionData | null>(null);

    useEffect(() => {
        setDrawerVisible(visible);
        if (!visible) {
            setEdges?.((edges) => {
                return edges.map(item => {
                    item.animated = false
                    return item
                })
            })
        }
    }, [visible]);

    useEffect(() => {
        // 监听任务执行进度
        const handleTaskProgress = (_, event: any) => {
            console.log('收到任务执行进度:', event);
            if (event.eventType === 'step_start' && event?.currentTask?.edgeId) {
                setEdges?.((edges) => {
                    return edges.map(item => {
                        if (item.id === event?.currentTask?.edgeId) {
                            item.animated = true
                        }
                        return item
                    })
                })
            }
            // 特别处理 log 事件类型 - 打印到控制台
            if (event.eventType === 'log') {
                console.log(`[${event.level?.toUpperCase()}] ${event.message}`, ...(event.args || []));
            }

            const executionData: ExecutionData = {
                executionId: event.executionId || `${event.eventType}-${Date.now()}`,
                eventType: event.eventType,
                timestamp: new Date(),
                startTime: event.startTime,
                currentStep: event.step || 0,
                totalSteps: event.totalSteps || 0,
                currentTask: event.currentTask,
                taskName: event.taskName || event.nodeType,
                nodeType: event.nodeType,
                duration: event.duration || 0,
                completedTasks: event.completedTasks || [],
                remainingTasks: event.remainingTasks || [],
                error: event.error,
                result: event.result,
                isRunning: event.eventType !== 'complete' && event.eventType !== 'error' && event.eventType !== 'log',
                // 添加日志字段
                level: event.level,
                message: event.message,
                args: event.args,
                // 保存原始事件数据
                rawEventData: event
            };

            // 修改逻辑：所有事件都作为独立记录添加到历史中
            setExecutionHistory(prev => {
                // 为每个事件创建唯一的标识符，确保不会被覆盖
                const uniqueId = `${event.executionId || 'unknown'}-${event.eventType}-${Date.now()}`;
                const dataWithUniqueId = { ...executionData, executionId: uniqueId };

                // 直接添加到顶部，限制最多200条记录
                return [dataWithUniqueId, ...prev.slice(0, 199)];
            });

            // 设置当前执行（只对执行类事件有效）
            if (executionData.isRunning) {
                setCurrentExecution(executionData);
                setDrawerVisible(true);
            } else if (event.eventType === 'complete' || event.eventType === 'error') {
                setCurrentExecution(null);
            }
        };

        if (window.ipcRenderer) {
            window.ipcRenderer.on('task_running_progress', handleTaskProgress);
        }

        return () => {
            if (window.ipcRenderer) {
                window.ipcRenderer.removeAllListeners('task_running_progress');
            }
        };
    }, [setEdges]);

    // 获取状态配置
    const getStatusConfig = (eventType: string) => {
        switch (eventType) {
            case 'start':
                return { status: 'processing' as const, color: 'blue', text: '开始执行' };
            case 'step_start':
                return { status: 'processing' as const, color: 'blue', text: '执行中' };
            case 'step_success':
                return { status: 'processing' as const, color: 'green', text: '步骤完成' };
            case 'step_error':
                return { status: 'error' as const, color: 'red', text: '执行失败' };
            case 'complete':
                return { status: 'success' as const, color: 'green', text: '执行完成' };
            case 'error':
                return { status: 'error' as const, color: 'red', text: '执行错误' };
            case 'log':
                return { status: 'default' as const, color: 'purple', text: '日志输出' };
            default:
                return { status: 'default' as const, color: 'gray', text: '未知状态' };
        }
    };

    // 根据日志级别获取颜色
    const getLogLevelColor = (level?: string) => {
        switch (level?.toLowerCase()) {
            case 'error':
                return 'red';
            case 'warn':
            case 'warning':
                return 'orange';
            case 'info':
                return 'blue';
            case 'debug':
                return 'gray';
            default:
                return 'purple';
        }
    };

    // 格式化时间
    const formatDuration = (ms: number) => {
        if (!ms) return '0s';
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        }
        return `${seconds}s`;
    };

    // 获取执行时间
    const getElapsedTime = (startTime?: string) => {
        if (!startTime) return '0s';
        const elapsed = Date.now() - new Date(startTime).getTime();
        return formatDuration(elapsed);
    };

    // 执行历史列表项组件
    const ExecutionItem: React.FC<{ execution: ExecutionData }> = ({ execution }) => {
        const statusConfig = getStatusConfig(execution.eventType);

        // 特殊处理日志事件
        if (execution.eventType === 'log') {
            const logColor = getLogLevelColor(execution.level);
            return (
                <Card size="small" style={{ marginBottom: 8, backgroundColor: '#fafafa', borderLeft: `3px solid ${logColor}` }}>
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Space>
                                <Badge status={statusConfig.status} />
                                <Tag color={logColor}>{execution.level?.toUpperCase() || 'LOG'}</Tag>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {execution.timestamp.toLocaleTimeString()}
                                </Text>
                            </Space>
                        </Space>

                        <div>
                            <Text style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                                {execution.message}
                            </Text>
                            {execution.args && execution.args.length > 0 && (
                                <div style={{ marginTop: 4 }}>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        参数: {JSON.stringify(execution.args)}
                                    </Text>
                                </div>
                            )}
                        </div>

                        {/* 添加JSON数据折叠面板 */}
                        <Collapse size="small" ghost>
                            <Panel header="查看原始数据" key="1">
                                <ReactJson
                                    src={execution.rawEventData || {}}
                                    theme="rjv-default"
                                    collapsed={1}
                                    displayDataTypes={false}
                                    displayObjectSize={false}
                                    enableClipboard={false}
                                    name={false}
                                    style={{ fontSize: '12px' }}
                                />
                            </Panel>
                        </Collapse>
                    </Space>
                </Card>
            );
        }

        // 处理其他事件类型
        const progressPercent = execution.totalSteps > 0
            ? Math.round((execution.currentStep / execution.totalSteps) * 100)
            : 0;

        return (
            <Card size="small" style={{ marginBottom: 8 }}>
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Space>
                            <Badge status={statusConfig.status} />
                            <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                {execution.timestamp.toLocaleTimeString()}
                            </Text>
                        </Space>
                        <Space>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                执行时间: {getElapsedTime(execution.startTime)}
                            </Text>
                        </Space>
                    </Space>

                    {execution.totalSteps > 0 && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={{ fontSize: '12px' }}>进度</Text>
                                <Text style={{ fontSize: '12px' }}>
                                    {execution.currentStep}/{execution.totalSteps}
                                </Text>
                            </div>
                            <Progress
                                percent={progressPercent}
                                size="small"
                                status={statusConfig.status === 'error' ? 'exception' : 'active'}
                                showInfo={false}
                            />
                        </div>
                    )}

                    {execution.currentTask && (
                        <div>
                            <Text strong style={{ fontSize: '13px' }}>
                                {execution.taskName}
                            </Text>
                            {execution.nodeType && (
                                <Tag size="small" style={{ marginLeft: 8 }}>
                                    {execution.nodeType}
                                </Tag>
                            )}
                        </div>
                    )}

                    {execution.error && (
                        <Text type="danger" style={{ fontSize: '12px' }}>
                            错误: {execution.error}
                        </Text>
                    )}

                    {/* 添加JSON数据折叠面板 */}
                    <Collapse size="small" ghost>
                        <Panel header="查看原始数据" key="1">
                            <ReactJson
                                src={execution.rawEventData || {}}
                                theme="rjv-default"
                                collapsed={1}
                                displayDataTypes={false}
                                displayObjectSize={false}
                                enableClipboard={false}
                                name={false}
                                style={{ fontSize: '12px' }}
                            />
                        </Panel>
                    </Collapse>
                </Space>
            </Card>
        );
    };

 

    const handleClose = () => {
        setDrawerVisible(false);
        onClose?.();
    };

    const clearHistory = () => {
        setExecutionHistory([]);
    };

    return (
        <>
         

            {/* 执行历史 Drawer */}
            <Drawer
                title={(
                    <Space>
                        <span>执行历史</span>
                        <Badge count={executionHistory.length} showZero />
                    </Space>
                )}
                placement="left"
                open={drawerVisible}
                onClose={handleClose}
                maskClosable={false}
                extra={
                    <Space>
                        <Button
                            size="small"
                            onClick={clearHistory}
                            disabled={executionHistory.length === 0}
                        >
                            清空历史
                        </Button>
                    </Space>
                }
            >
                <div style={{ overflowY: 'auto' }}>
                    {executionHistory.length === 0 ? (
                        <Empty
                            description="暂无执行记录"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        executionHistory.map((execution, index) => (
                            <ExecutionItem
                                key={execution.executionId + '-' + index}
                                execution={execution}
                            />
                        ))
                    )}
                </div>
            </Drawer>
        </>
    );
};

export default ExecutionStatusPanel;