import * as Cesium from "cesium";
import { ElMessage } from "element-plus";
const deleteEntity = function(viewer, entity) {
    let toDel = viewer.entities.getById(entity.TargetObject);
    if(toDel === undefined){
        ElMessage.warning("删除错误：对象已经不存在")
    }
    viewer.entities.remove(toDel)
};

export default deleteEntity