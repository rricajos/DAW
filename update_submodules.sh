#!/bin/bash

echo "Iniciando submódulos si no están inicializados..."
git submodule init

# Actualizamos todos los submódulos a la última versión remota
echo "Actualizando todos los submódulos..."
git submodule update --remote --merge

# Comprobamos si hay cambios en los submódulos
if [[ `git status --porcelain` ]]; then
    echo "Cambios detectados en los submódulos. Agregando cambios..."
    git add .
    
    # Hacemos commit con los cambios
    echo "Haciendo commit de los submódulos actualizados..."
    git commit -m "Actualizar todos los submódulos a la última versión"
    
    # (Opcional) Hacer push de los cambios al repositorio remoto
    read -p "¿Deseas hacer push de los cambios al repositorio remoto? (s/n) " respuesta
    if [[ $respuesta == "s" ]]; then
        echo "Haciendo push de los cambios..."
        git push origin $(git rev-parse --abbrev-ref HEAD)
    else
        echo "Los cambios no se enviarán al remoto. Sólo están en tu local."
    fi
else
    echo "No hay cambios en los submódulos."
fi
