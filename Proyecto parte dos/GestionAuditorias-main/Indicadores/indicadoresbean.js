import jakarta.faces.bean.ManagedBean;
import jakarta.faces.bean.ViewScoped;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@ManagedBean(name="indicadoresAuditoriaBean")
@ViewScoped
public class IndicadoresAuditoriaBean implements Serializable {

    private List<ObjetivoAuditoria> objetivos = new ArrayList<>();
    private String nuevoObjetivo;
    private Integer nuevaEfectividad;

    public IndicadoresAuditoriaBean() {
        // Datos iniciales
        objetivos.add(new ObjetivoAuditoria("Cumplimiento estándar Talento Humano", 85));
        objetivos.add(new ObjetivoAuditoria("Gestión programa de capacitación", 90));
        objetivos.add(new ObjetivoAuditoria("Selección y contratación institucional", 75));
        objetivos.add(new ObjetivoAuditoria("Inducción y reinducción", 80));
        objetivos.add(new ObjetivoAuditoria("Gestión de hojas de vida", 88));
    }

    public void agregarObjetivo() {
        if (nuevoObjetivo != null && nuevaEfectividad != null) {
            objetivos.add(new ObjetivoAuditoria(nuevoObjetivo, nuevaEfectividad));
            nuevoObjetivo = null;
            nuevaEfectividad = null;
        }
    }

    // Getters y Setters
    public List<ObjetivoAuditoria> getObjetivos() { return objetivos; }
    public String getNuevoObjetivo() { return nuevoObjetivo; }
    public void setNuevoObjetivo(String nuevoObjetivo) { this.nuevoObjetivo = nuevoObjetivo; }
    public Integer getNuevaEfectividad() { return nuevaEfectividad; }
    public void setNuevaEfectividad(Integer nuevaEfectividad) { this.nuevaEfectividad = nuevaEfectividad; }
}

public class ObjetivoAuditoria {
    private String nombre;
    private Integer efectividad;

    public ObjetivoAuditoria(String nombre, Integer efectividad) {
        this.nombre = nombre;
        this.efectividad = efectividad;
    }

    public String getNombre() { return nombre; }
    public Integer getEfectividad() { return efectividad; }
}
